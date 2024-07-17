import { mutationWithClientMutationId } from "graphql-relay";
import { User, UserModel } from "../user-model";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { UserType } from "../user-type";
import { successField } from "@entria/graphql-mongo-helpers";
import { sendEmail, UserConfirmationTemplate } from "../../../notification";
import { ConfirmationLinkModel } from "../../confirmation-link";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { BusinessRuleException } from "../../../exceptions";

export type RegisterUserInput = Pick<
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
    if (!cpf.isValid(taxId) && !cnpj.isValid(taxId)) {
      throw new BusinessRuleException("Informe um CPF ou CNPJ válido.");
    }

    if (password !== passwordConfirmation) {
      throw new BusinessRuleException("As senhas não são iguais.");
    }

    const [emailExists, taxIdExists] = await Promise.all([
      UserModel.exists({ email }),
      UserModel.exists({ taxId }),
    ]);

    if (emailExists || taxIdExists) {
      throw new BusinessRuleException(
        "CPF/CNPJ e/ou E-mail já pertence(m) a uma conta."
      );
    }

    const user = await new UserModel({
      email,
      fullName,
      password,
      taxId,
    }).save();

    const { code } = await sendEmail({
      linkUri: "/confirmation",
      subject: "[Bank] Link de Confirmação",
      template: UserConfirmationTemplate,
      to: email,
    });

    await new ConfirmationLinkModel({
      code,
      userTaxId: user.taxId,
    }).save();

    return {
      user,
      message:
        "Operação realizada com sucesso! Verifique seu e-mail para confirmar a criação da sua conta.",
    };
  },
  outputFields: {
    user: {
      type: UserType,
      resolve: async (payload) => (await payload)?.user,
      ...successField,
    },
    message: {
      type: GraphQLString,
      resolve: async (payload) => (await payload)?.message,
      ...successField,
    },
  },
});
