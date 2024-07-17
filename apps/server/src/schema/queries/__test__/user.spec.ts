import { createUser } from "../../../modules/user/fixture";
import { clearDbAndRestartCounters } from "../../../../test/clear-database";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { schema } from "../../../schema";
import { getContext } from "../../../get-context";
import { GraphQLError } from "graphql";

interface User {
  user: {
    fullName: string;
    taxId: string;
    email: string;
  };
}

const makeSut = async () => {
  const user = await createUser();

  return { user };
};

const fetchResult = (contextValue: unknown) => {
  const query = `
        query userQuery {
            user {
                fullName
                taxId
                email
            }
        }
    `;

  return getGraphqlResult<User>({
    source: query,
    schema,
    contextValue,
  });
};

describe("User Queries", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  beforeEach(() => {
    clearDbAndRestartCounters();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throw unauthorized if user is not logged", async () => {
    const { data, errors } = await fetchResult(getContext({ user: undefined }));

    expect(data?.user).toBeNull();
    expect((errors as GraphQLError[])[0].message).toBe(
      "Acesso não autorizado."
    );
  });

  it("should returns user data if user is logged", async () => {
    const { user } = await makeSut();

    const { data } = await fetchResult(getContext({ user }));

    expect(data?.user).not.toBeNull();
    expect(data?.user.email).toBe(user.email);
    expect(data?.user.fullName).toBe(user.fullName);
    expect(data?.user.taxId).toBe(user.taxId);
  });
});
