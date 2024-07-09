import { schema } from "../../../schema";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { LoginEmailAccessInput } from "../mutations/login-email-access";
import { GraphQLError } from "graphql";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { createUser } from "../fixture";
import { AuthenticationLinkModel } from "../../../modules/authentication-link";
import crypto from "node:crypto";

interface LoginEmailAccessResponse {
  LoginEmailAccess: {
    message: string;
  };
}

const fetchResult = (variableValues: LoginEmailAccessInput) => {
  const mutation = `
        mutation loginEmailAccessMutation($email: String!) {
            LoginEmailAccess(input: { email: $email }) {
                message
            }
        }
    `;

  return getGraphqlResult<LoginEmailAccessResponse>({
    schema,
    variableValues,
    source: mutation,
  });
};

describe("LoginEmailAccessMutation", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throws if user is not found", async () => {
    const variableValues: LoginEmailAccessInput = {
      email: "invalid_mail@mail.com",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.LoginEmailAccess).toBeNull();
    expect((errors as GraphQLError[])[0].message).toBe(
      "Usuário não encontrado."
    );
  });

  it("should throws if user is not confirmed", async () => {
    const { email } = await createUser();

    const variableValues: LoginEmailAccessInput = {
      email,
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.LoginEmailAccess).toBeNull();
    expect((errors as GraphQLError[])[0].message).toBe(
      "O usuário não está ativo. Ative sua conta através do link de confirmação enviado por e-mail para prosseguir."
    );
  });

  it("should create an authentication link model document", async () => {
    const { email, taxId } = await createUser({ confirmed: true });

    const variableValues: LoginEmailAccessInput = {
      email,
    };

    const authLinkModelSpy = jest.spyOn(AuthenticationLinkModel, "create");
    jest.spyOn(crypto, "randomUUID").mockReturnValueOnce("valid-u-u-i-d");

    await fetchResult(variableValues);

    expect(authLinkModelSpy).toHaveBeenCalledWith({
      userTaxId: taxId,
      code: "valid-u-u-i-d",
    });
  });
});
