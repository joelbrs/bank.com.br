import { mutationWithClientMutationId } from "graphql-relay";
import { User, UserModel } from "../user-model";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../user-type";
import { successField } from "@entria/graphql-mongo-helpers";

type RegisterUserInput = Pick<
  User,
  "fullName" | "email" | "password" | "taxId"
> & { passwordConfirmation: string };

export const RegisterUserMutation = mutationWithClientMutationId({
  name: "RegisterUser",
  inputFields: {
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    passwordConfirmation: {
      type: new GraphQLNonNull(GraphQLString),
    },
    taxId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({
    email,
    fullName,
    password,
    passwordConfirmation,
    taxId,
  }: RegisterUserInput) => {
    if (password !== passwordConfirmation) {
      throw new Error("As senhas não são iguais.");
    }

    const user = await new UserModel({
      email,
      fullName,
      password,
      taxId,
    }).save();

    return {
      user,
      success: "Operação realizada com sucesso!",
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: async (payload) => (await payload)?.user,
      ...successField,
    },
  },
});
