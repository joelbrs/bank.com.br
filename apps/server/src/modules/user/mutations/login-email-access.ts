import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { UserModel } from "../user-model";
import {
  BusinessRuleException,
  EntityNotFoundException,
} from "../../../exceptions";
import { AuthenticationLinkModel } from "../../../modules/authentication-link";
import { sendEmail, UserLoginTemplate } from "../../../notification";
import { successField } from "@entria/graphql-mongo-helpers";

export type LoginEmailAccessInput = {
  email: string;
};

export const LoginEmailAccessMutation = mutationWithClientMutationId({
  name: "LoginEmailAccess",
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ email }: LoginEmailAccessInput) => {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new EntityNotFoundException("Usuário");
    }

    if (!user.confirmed) {
      throw new BusinessRuleException(
        "O usuário não está ativo. Ative sua conta através do link de confirmação enviado por e-mail para prosseguir."
      );
    }

    const { code } = await sendEmail({
      linkUri: "/authenticate",
      subject: "[Bank] Link para Login",
      template: UserLoginTemplate,
      to: email,
    });

    await AuthenticationLinkModel.create({
      userTaxId: user.taxId,
      code,
    });

    return {
      message:
        "Operação realizada com sucesso! Verifique seu e-mail para confirmar a criação da sua conta.",
    };
  },
  outputFields: {
    message: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload) => (await payload)?.message,
      ...successField,
    },
  },
});
