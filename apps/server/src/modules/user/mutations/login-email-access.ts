import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { UserModel } from "../user-model";
import {
  BusinessRuleException,
  EntityNotFoundException,
} from "../../../exceptions";
import { randomUUID } from "crypto";
import { AuthenticationLinkModel } from "../../../modules/authentication-link";
import { env } from "../../../config";
import { resend, UserLoginTemplate } from "../../../mail";
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

    const authCode = randomUUID();

    await AuthenticationLinkModel.create({
      userTaxId: user.taxId,
      code: authCode,
    });

    const authLink = new URL("/authenticate", env.API_BASE_URL);
    authLink.searchParams.set("code", authCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

    await resend.emails.send({
      from: "Bank <noreply@bank-woovi.joelf.tech>",
      to: email,
      subject: "[Bank] Link para Login",
      react: UserLoginTemplate({
        email,
        link: authLink?.toString(),
      }),
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
