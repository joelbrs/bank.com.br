import { schema } from "../../../schema";
import { clearDbAndRestartCounters } from "../../../../test/clear-database";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { GraphQLError } from "graphql";
import { RegisterUserInput } from "../mutations/register-user";

interface RegisterMutationResponse {
  RegisterUser: {
    user: {
      fullName: string;
    };
  };
}

const mutation = `
        mutation registerUserMutation($fullName: String!, $email: String!, $password: String!, $taxId: String!, $passwordConfirmation: String!) {
            RegisterUser(input: { fullName: $fullName, email: $email, password: $password, taxId: $taxId, passwordConfirmation: $passwordConfirmation }) {
                user {
                    fullName
                }
            }
        }
    `;

const fetchResult = (variableValues: RegisterUserInput) => {
  return getGraphqlResult<RegisterMutationResponse>({
    source: mutation,
    variableValues,
    schema,
  });
};

jest.mock("../../../mail");

describe("RegisterUserMutation", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  beforeEach(() => {
    clearDbAndRestartCounters();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throws if password and passwordConfirmation dont match", async () => {
    const variableValues = {
      fullName: "valid_fullname",
      email: "valid_mail@mail.com",
      password: "valid_password",
      passwordConfirmation: "invalid_password",
      taxId: "valid_valid_taxId",
    };

    jest.spyOn(cpf, "isValid").mockReturnValueOnce(true);
    jest.spyOn(cnpj, "isValid").mockReturnValueOnce(true);

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.RegisterUser).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "As senhas não são iguais."
    );
  });

  it("should throws if taxId is invalid", async () => {
    const variableValues = {
      fullName: "valid_fullname",
      email: "valid_mail@mail.com",
      password: "valid_password",
      passwordConfirmation: "valid_password",
      taxId: "invalid_valid_taxId",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.RegisterUser).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Informe um CPF ou CNPJ válido."
    );
  });

  it("should register an user if fields are valid", async () => {
    const variableValues = {
      fullName: "valid_fullname",
      email: "valid_mail@mail.com",
      password: "valid_password",
      passwordConfirmation: "valid_password",
      taxId: "valid_taxId",
    };

    jest.spyOn(cpf, "isValid").mockReturnValueOnce(true);
    jest.spyOn(cnpj, "isValid").mockReturnValueOnce(true);

    const { data } = await fetchResult(variableValues);

    expect(data?.RegisterUser.user?.fullName).toBe("valid_fullname");
  });
});
