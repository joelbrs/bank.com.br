import { schema } from "../../../schema";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { LoginPasswordAccessInput } from "../mutations/login-password-access";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { randomUUID } from "crypto";
import { GraphQLError } from "graphql";
import { createUser } from "../fixture";
import { env } from "../../../config";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginPasswordAccessResponse {
  LoginPasswordAccess: {
    userId: string;
  };
}

const fetchResult = (variableValues: LoginPasswordAccessInput) => {
  const mutation = `
        mutation loginPasswordAccessMutation($taxId: String!, $password: String!) {
            LoginPasswordAccess(input: { taxId: $taxId, password: $password }) {
                userId
            }
        }
    `;

  return getGraphqlResult<LoginPasswordAccessResponse>({
    schema,
    variableValues,
    source: mutation,
  });
};

describe("LoginPasswordAccessMutation", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throws if user doesnt exists", async () => {
    const variableValues: LoginPasswordAccessInput = {
      taxId: randomUUID(),
      password: "valid_password",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.LoginPasswordAccess).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Usuário não encontrado."
    );
  });

  it("should throws if user is not confirmed", async () => {
    const { taxId } = await createUser();

    const variableValues: LoginPasswordAccessInput = {
      taxId,
      password: "valid_password",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.LoginPasswordAccess).toBeNull();
    expect((errors as GraphQLError[])[0].message).toBe(
      "O usuário não está ativo. Ative sua conta através do link de confirmação enviado por e-mail para prosseguir."
    );
  });

  it("should throws if password dont match", async () => {
    const { taxId } = await createUser({ confirmed: true });

    const variableValues: LoginPasswordAccessInput = {
      taxId,
      password: "invalid_password",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.LoginPasswordAccess).toBeNull();
    expect((errors as GraphQLError[])[0].message).toBe(
      "Acesso não autorizado."
    );
  });

  it("should create token jwt if fields are valid", async () => {
    const { taxId, _id } = await createUser({ confirmed: true });

    const variableValues: LoginPasswordAccessInput = {
      taxId,
      password: "valid_password",
    };

    const jwtSpy = jest.spyOn(jwt, "sign");
    jest.spyOn(bcrypt, "compare").mockImplementation(() => true);

    await fetchResult(variableValues);

    expect(jwtSpy).toHaveBeenCalledWith(
      { subId: _id?.toString() },
      env.JWT_KEY
    );
  });
});
