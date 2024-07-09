import { ConfirmationLinkModel } from "../../../modules/confirmation-link";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { UserModel } from "../user-model";
import { AccountModel } from "../../../modules/account";
import { successField } from "@entria/graphql-mongo-helpers";

export type ConfirmUserInput = {
  code: string;
  redirect: string;
};

export const ConfirmUserMutation = mutationWithClientMutationId({
  name: "ConfirmUser",
  inputFields: {
    code: {
      type: new GraphQLNonNull(GraphQLString),
    },
    redirect: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ code }: ConfirmUserInput) => {
    const existingCode = await ConfirmationLinkModel.findOne({ code });

    if (!existingCode) {
      throw new Error("Acesso não autorizado.");
    }

    const user = await UserModel.findOne({ taxId: existingCode.userTaxId });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    user.confirmed = true;

    await Promise.all([
      user?.save(),
      AccountModel.create({
        userTaxId: user.taxId,
      }),
      ConfirmationLinkModel.deleteOne({ code }),
    ]);

    return {
      userId: user._id,
    };
  },
  outputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload) => (await payload)?.userId,
      ...successField,
    },
  },
});
