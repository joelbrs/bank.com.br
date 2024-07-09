import { mutationWithClientMutationId } from "graphql-relay";
import { User, UserModel } from "../user-model";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../user-type";
import { successField } from "@entria/graphql-mongo-helpers";
import { randomUUID } from "crypto";
import { env } from "../../../config";
import { resend, UserConfirmationTemplate } from "../../../mail";
import { ConfirmationLink } from "../../confirmation-link";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { BusinessRuleException } from "../../../exceptions";

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
    if (!cpf.isValid(taxId) || !cnpj.isValid(taxId)) {
      throw new BusinessRuleException("Informe um CPF ou CNPJ válido.");
    }

    if (password !== passwordConfirmation) {
      throw new BusinessRuleException("As senhas não são iguais.");
    }

    const user = await new UserModel({
      email,
      fullName,
      password,
      taxId,
    }).save();

    const confirmationCode = randomUUID();

    const confirmationLink = new URL("/confirmacao", env.API_BASE_URL);
    confirmationLink.searchParams.set("code", confirmationCode);
    confirmationLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

    await resend.emails.send({
      from: "Bank <noreply@bank-woovi.joelf.tech>",
      to: email,
      subject: "[Bank] Link de Confirmação",
      react: UserConfirmationTemplate({
        email,
        link: confirmationLink.toString(),
      }),
    });

    await new ConfirmationLink({
      code: confirmationCode,
      userTaxId: user.taxId,
    }).save();

    return {
      user,
      success:
        "Operação realizada com sucesso! Verifique seu e-mail para confirmar a criação da sua conta.",
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
