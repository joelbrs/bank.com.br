import { schema } from "../../../schema";
import { randomUUID } from "crypto";
import { GraphQLError } from "graphql";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { createConfirmationLink } from "../../../modules/confirmation-link";
import { createUser } from "../fixture";
import { ConfirmUserInput } from "../mutations/confirm-user";
import { AccountModel } from "../../account";

interface ConfirmUserMutationResponse {
  ConfirmUser: {
    userId: string;
  };
}

const fetchResult = (variableValues: ConfirmUserInput) => {
  const mutation = `
    mutation confirmUserAccountMutation($code: String!, $redirect: String!) {
      ConfirmUser(input: { code: $code, redirect: $redirect }) {
        userId
      }
    }
  `;

  return getGraphqlResult<ConfirmUserMutationResponse>({
    source: mutation,
    variableValues,
    schema,
  });
};

describe("ConfirmUserMutation", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throws unauthorized if dont exist confirmation link", async () => {
    const variableValues = {
      code: randomUUID(),
      redirect: "/",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.ConfirmUser).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Acesso não autorizado."
    );
  });

  it("should throw not found if dont exist user", async () => {
    const { code } = await createConfirmationLink();

    const variableValues = {
      code,
      redirect: "/",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.ConfirmUser).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Usuário não encontrado."
    );
  });

  it("should create an user account if fields are valid", async () => {
    const { taxId } = await createUser();
    const { code } = await createConfirmationLink({ userTaxId: taxId });

    const variableValues = {
      code,
      redirect: "/",
    };

    const accountSpy = jest.spyOn(AccountModel, "create");

    await fetchResult(variableValues);

    expect(accountSpy).toHaveBeenCalledWith({
      userTaxId: taxId,
    });
  });

  it("should returns user's id when sucessfull", async () => {
    const { taxId, _id } = await createUser();
    const { code } = await createConfirmationLink({ userTaxId: taxId });

    const variableValues = {
      code,
      redirect: "/",
    };

    const { data } = await fetchResult(variableValues);

    expect(data?.ConfirmUser.userId).toBe(_id?.toString());
  });
});
