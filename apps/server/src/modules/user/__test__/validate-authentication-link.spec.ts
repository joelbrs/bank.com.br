import { schema } from "../../../schema";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { ValidateAuthenticationLinkInput } from "../mutations/validate-authentication-link";

import { randomUUID } from "crypto";
import { GraphQLError } from "graphql";
import { createAuthenticationLink } from "../../authentication-link/fixtures";
import { AuthenticationLinkModel } from "../../authentication-link";
import { createUser } from "../fixture";

interface ValidateAuthenticationLinkResponse {
  ValidateAuthenticationLink: {
    userId: string;
  };
}

const fetchResult = (variableValues: ValidateAuthenticationLinkInput) => {
  const mutation = `
        mutation validateAuthenticationLinkMutation($code: String!, $redirect: String!) {
            ValidateAuthenticationLink(input: { code: $code, redirect: $redirect }) {
                userId
            }
        }
    `;

  return getGraphqlResult<ValidateAuthenticationLinkResponse>({
    schema,
    variableValues,
    source: mutation,
  });
};

describe("ValidateAuthenticationLink", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throws if authentication link is invalid", async () => {
    const variableValues: ValidateAuthenticationLinkInput = {
      code: randomUUID(),
      redirect: "/",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.ValidateAuthenticationLink).toBeNull();
    expect((errors as GraphQLError[])[0].message).toBe(
      "Acesso não autorizado."
    );
  });

  it("should throws if user is not found", async () => {
    const { code } = await createAuthenticationLink();

    const variableValues: ValidateAuthenticationLinkInput = {
      code,
      redirect: "/",
    };

    const { data, errors } = await fetchResult(variableValues);

    expect(data?.ValidateAuthenticationLink).toBeNull();
    expect((errors as GraphQLError[])[0].message).toBe(
      "Acesso não autorizado."
    );
  });
});
