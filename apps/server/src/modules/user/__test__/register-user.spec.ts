import { schema } from "../../../schema";
import { clearDbAndRestartCounters } from "../../../../test/clear-database";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";

import { cnpj, cpf } from "cpf-cnpj-validator";
import { GraphQLError } from "graphql";

interface RegisterMutationResponse {
  RegisterUser: {
    user: {
      fullName: string;
    };
  };
  errors?: ReadonlyArray<GraphQLError>;
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

  it("should return null data if taxId is invalid", async () => {
    const variableValues = {
      fullName: "valid_fullname",
      email: "valid_mail@mail.com",
      password: "valid_password",
      passwordConfirmation: "valid_password",
      taxId: "invalid_valid_taxId",
    };

    jest.spyOn(cpf, "isValid").mockReturnValueOnce(false);

    const { data } = await getGraphqlResult<RegisterMutationResponse>({
      source: mutation,
      variableValues,
      schema,
    });

    expect(data?.RegisterUser).toBeNull();
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

    const { data } = await getGraphqlResult<RegisterMutationResponse>({
      source: mutation,
      variableValues,
      schema,
    });

    expect(data?.RegisterUser.user?.fullName).toBe("valid_fullname");
  });
});
