import { mongooseConnection } from "../../../../test/mongoose-connection";
import { mongooseDisconnect } from "../../../../test/mongoose-disconnect";
import { CreateTransactionInput } from "../mutations/create-transaction";
import { getGraphqlResult } from "../../../../test/get-graphql-result";
import { schema } from "../../../schema";
import { createUser } from "../../../modules/user/fixture";
import { AccountModel, createAccount } from "../../../modules/account";
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
        mutation createTransactionMutation($receiverTaxId: String!, $value: String!) {
            CreateTransaction(input: { receiverTaxId: $receiverTaxId, value: $value }) {
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

  it("should throws if funds are insufficient", async () => {
    const contextUser = await createUser();
    await createAccount({ userTaxId: contextUser.taxId });

    const variableValues: CreateTransactionInput = {
      receiverTaxId: randomUUID(),
      value: "10.00",
    };

    const { data, errors } = await fetchResult(
      variableValues,
      getContext({ user: contextUser })
    );

    expect(data?.CreateTransaction).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Saldo insuficiente para efetuar a transação."
    );
  });

  it("should throw if receiver account is not found", async () => {
    const contextUser = await createUser();
    await createAccount({
      userTaxId: contextUser.taxId,
      balance: new mongoose.Types.Decimal128("10.0") as any,
    });

    const variableValues: CreateTransactionInput = {
      receiverTaxId: randomUUID(),
      value: "10.0",
    };

    const { data, errors } = await fetchResult(
      variableValues,
      getContext({ user: contextUser })
    );

    expect(data?.CreateTransaction).toBeNull();
    expect((errors as GraphQLError[])[0]?.message).toBe(
      "Conta não encontrado."
    );
  });

  it("should increment receiver balance and decrement sender balance when fields are valid", async () => {
    const contextUser = await createUser();
    const receiverUser = await createUser();

    await createAccount({
      userTaxId: contextUser.taxId,
      balance: new mongoose.Types.Decimal128("10.0") as any,
    });

    const { userTaxId: receiverTaxId } = await createAccount({
      userTaxId: receiverUser?.taxId,
    });

    const variableValues: CreateTransactionInput = {
      receiverTaxId,
      value: "10.0",
    };

    await fetchResult(variableValues, getContext({ user: contextUser }));

    const [senderAccount, receiverAccount] = await Promise.all([
      AccountModel.findOne({
        userTaxId: contextUser?.taxId,
      }),
      AccountModel.findOne({
        userTaxId: receiverTaxId,
      }),
    ]);

    expect(senderAccount?.balance).toEqual(
      new mongoose.Types.Decimal128("0.0")
    );
    expect(receiverAccount?.balance).toEqual(
      new mongoose.Types.Decimal128("10.0")
    );
  });

  it("should create a transaction when fields are valid", async () => {
    const contextUser = await createUser();
    const receiverUser = await createUser();

    await createAccount({
      userTaxId: contextUser.taxId,
      balance: new mongoose.Types.Decimal128("10.0") as any,
    });

    const { userTaxId: receiverTaxId } = await createAccount({
      userTaxId: receiverUser?.taxId,
    });

    const variableValues: CreateTransactionInput = {
      receiverTaxId,
      value: "10.0",
    };

    const transactionModelSpy = jest.spyOn(TransactionModel, "create");

    await fetchResult(variableValues, getContext({ user: contextUser }));

    expect(transactionModelSpy).toHaveBeenCalledWith({
      senderTaxId: contextUser.taxId,
      receiverTaxId: receiverTaxId,
      value: variableValues.value,
    });
  });

  it("should returns transaction id on success", async () => {
    const contextUser = await createUser();
    const receiverUser = await createUser();

    await createAccount({
      userTaxId: contextUser.taxId,
      balance: new mongoose.Types.Decimal128("10.0") as any,
    });

    const { userTaxId: receiverTaxId } = await createAccount({
      userTaxId: receiverUser?.taxId,
    });

    const variableValues: CreateTransactionInput = {
      receiverTaxId,
      value: "10.0",
    };

    const { data } = await fetchResult(
      variableValues,
      getContext({ user: contextUser })
    );

    expect(data?.CreateTransaction.transactionId).toBeDefined();
  });
});
