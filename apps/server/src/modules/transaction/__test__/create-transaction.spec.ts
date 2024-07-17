import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { CreateTransactionInput } from "../mutations/create-transaction";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { schema } from "../../../schema";
import { createUser } from "../../../modules/user/fixture";
import { createAccount } from "../../../modules/account";
import { randomUUID } from "crypto";
import { getContext } from "../../../get-context";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { TransactionModel } from "../transaction-model";
import { clearDbAndRestartCounters } from "../../../../test/clear-database";

interface CreateTransactionResponse {
  CreateTransaction: {
    transactionId: string;
  };
}

const fetchResult = (
  variableValues: CreateTransactionInput,
  contextValue: unknown
) => {
  const mutation = `
        mutation createTransactionMutation($receiverAccountNumber: String!, $value: String!) {
            CreateTransaction(input: { receiverAccountNumber: $receiverAccountNumber, value: $value }) {
                transactionId
            }
        }
    `;

  return getGraphqlResult<CreateTransactionResponse>({
    source: mutation,
    variableValues,
    schema,
    contextValue,
  });
};

const makeSut = async () => {
  const [senderUser, receiverUser] = await Promise.all([
    createUser(),
    createUser(),
  ]);

  const [senderAccount, receiverAccount] = await Promise.all([
    createAccount({
      userTaxId: senderUser?.taxId,
      balance: mongoose.Types.Decimal128.fromString("10.0") as any,
    }),
    createAccount({ userTaxId: receiverUser?.taxId }),
  ]);

  return {
    senderUser,
    receiverUser,
    senderAccount,
    receiverAccount,
  };
};

describe("CreateTransactionMutation", () => {
  beforeAll(() => {
    mongooseConnection();
  });

  beforeEach(() => {
    clearDbAndRestartCounters();
  });

  afterAll(() => {
    mongooseDisconnect();
  });

  it("should throw if no idempotency key is provided", async () => {
    const senderUser = await createUser();

    const variableValues: CreateTransactionInput = {
      receiverAccountNumber: randomUUID(),
      value: "10.0",
    };

    const { data, errors } = await fetchResult(
      variableValues,
      getContext({ user: senderUser })
    );

    expect(data?.CreateTransaction).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "A chave de idempotência é inválida."
    );
  });

  it("should throws if funds are insufficient", async () => {
    const { senderUser } = await makeSut();

    const variableValues: CreateTransactionInput = {
      receiverAccountNumber: randomUUID(),
      value: "20.0",
    };

    const { data, errors } = await fetchResult(
      variableValues,
      getContext({ user: senderUser, idempotentKey: randomUUID() })
    );

    expect(data?.CreateTransaction).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Saldo insuficiente para efetuar a transação."
    );
  });

  it("should throws if receiver account is not found", async () => {
    const { senderUser } = await makeSut();

    const variableValues: CreateTransactionInput = {
      receiverAccountNumber: randomUUID(),
      value: "10.0",
    };

    const { data, errors } = await fetchResult(
      variableValues,
      getContext({ user: senderUser, idempotentKey: randomUUID() })
    );

    expect(data?.CreateTransaction).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Conta não encontrado."
    );
  });

  it("should create a transaction when fields are valid", async () => {
    const { senderUser, receiverAccount } = await makeSut();

    const variableValues: CreateTransactionInput = {
      receiverAccountNumber: receiverAccount?.accountNumber,
      value: "10.0",
    };

    const idempotentKey = randomUUID();
    const transactionSpy = jest.spyOn(new TransactionModel(), "save");

    await fetchResult(
      variableValues,
      getContext({ user: senderUser, idempotentKey })
    );

    expect(transactionSpy).toHaveBeenCalled();
  });

  it("should returns transaction id on success", async () => {
    const { senderUser, receiverAccount } = await makeSut();

    const variableValues: CreateTransactionInput = {
      receiverAccountNumber: receiverAccount.accountNumber,
      value: "10.0",
    };

    const { data } = await fetchResult(
      variableValues,
      getContext({ user: senderUser, idempotentKey: randomUUID() })
    );

    expect(data?.CreateTransaction.transactionId).toBeDefined();
  });
});
