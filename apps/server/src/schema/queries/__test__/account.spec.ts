import { createUser } from "../../../modules/user/fixture";
import { clearDbAndRestartCounters } from "../../../../test/clear-database";
import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { Maybe } from "@repo/types/index";
import { schema } from "../../../schema";
import { createAccount } from "../../../modules/account";
import { getContext } from "../../../get-context";
import { GraphQLError } from "graphql";
import { randomUUID } from "crypto";

type AccountFilter = {
  accountNumber?: string | number;
};

interface Account {
  account: {
    accountNumber: string;
    userTaxId: string;
    balance: string;
    owner: {
      taxId: string;
    };
  };
}

const makeSut = async () => {
  const user = await createUser();
  const account = await createAccount({ userTaxId: user.taxId });

  return { user, account };
};

const fetchResult = <T>(
  contextValue: unknown,
  variableValues: Maybe<AccountFilter>
) => {
  const query = `
        query accountLoggedUserQuery($accountNumber: String) {
            account(accountNumber: $accountNumber) {
                accountNumber
                userTaxId
                balance
                owner {
                    taxId
                }
            }
        }
    `;

  return getGraphqlResult<T>({
    source: query,
    variableValues,
    schema,
    contextValue,
  });
};

describe("Account Queries", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  beforeEach(() => {
    clearDbAndRestartCounters();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throws unauhtorized if user is not logged when query account", async () => {
    const { data, errors } = await fetchResult<Account>(
      getContext({ user: undefined }),
      undefined
    );

    expect(data?.account).toBeNull();
    expect((errors as GraphQLError[])[0].message)?.toBe(
      "Acesso não autorizado."
    );
  });

  it("should return logged user account if no accountNumber is passed", async () => {
    const { user, account } = await makeSut();

    const { data } = await fetchResult<Account>(
      getContext({ user }),
      undefined
    );

    expect(data?.account.accountNumber).toBe(account.accountNumber);
    expect(data?.account.balance).toBe("0");
    expect(data?.account.userTaxId).toBe(account.userTaxId);
    expect(data?.account.owner.taxId).toBe(user?.taxId);
  });

  it("should return null if an inexistent account number is passed", async () => {
    const { user } = await makeSut();

    const variableValues: AccountFilter = {
      accountNumber: randomUUID(),
    };

    const { data } = await fetchResult<Account>(
      getContext({ user }),
      variableValues
    );

    expect(data?.account).toBeNull();
  });

  it("should return correct account if an existent account number is passed", async () => {
    const { user, account } = await makeSut();

    const variableValues: AccountFilter = {
      accountNumber: account.accountNumber,
    };

    const { data } = await fetchResult<Account>(
      getContext({ user }),
      variableValues
    );

    expect(data?.account.accountNumber).toBe(account.accountNumber);
    expect(data?.account.balance).toBe("0");
    expect(data?.account.userTaxId).toBe(account.userTaxId);
    expect(data?.account.owner.taxId).toBe(user?.taxId);
  });
});
