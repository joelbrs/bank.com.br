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
import { TransactionModel } from "../transaction-model";
import { clearDbAndRestartCounters } from "../../../../test/clear-database";
import { createTransaction } from "../fixtures";
import mongoose, { Decimal128, ObjectId } from "mongoose";
import { DeepPartial } from "@repo/types/index";
import * as Email from "../../../notification/send-email";
import { TransactionReceivedTemplate } from "../../../notification";

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
    }),
    createAccount({ userTaxId: receiverUser?.taxId }),
  ]);
  await createTransaction({
    senderAccountId: senderAccount._id as DeepPartial<ObjectId>,
    receiverAccountId: senderAccount._id as DeepPartial<ObjectId>,
    value: new mongoose.Types.Decimal128("10.0") as DeepPartial<Decimal128>,
  });

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
    const transactionSpy = jest.spyOn(TransactionModel.prototype, "save");

    await fetchResult(
      variableValues,
      getContext({ user: senderUser, idempotentKey })
    );

    expect(transactionSpy).toHaveBeenCalled();
  });

  //TODO: verify ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG error
  // it("should returns transaction id on success", async () => {
  //   const { senderUser, receiverAccount } = await makeSut();

  //   const variableValues: CreateTransactionInput = {
  //     receiverAccountNumber: receiverAccount?.accountNumber,
  //     value: "10.0",
  //   };

  //   const idempotentKey = randomUUID();

  //   const { data, errors } = await fetchResult(
  //     variableValues,
  //     getContext({ user: senderUser, idempotentKey })
  //   );
  //   console.log(errors);
  //   expect(data?.CreateTransaction.transactionId).toBeDefined();
  // });

  it("should send an email to receiver's email when transaction is successfully created", async () => {
    const { senderUser, receiverAccount, receiverUser } = await makeSut();

    const variableValues: CreateTransactionInput = {
      receiverAccountNumber: receiverAccount?.accountNumber,
      value: "10.0",
    };

    const idempotentKey = randomUUID();
    const emailSpy = jest.spyOn(Email, "sendEmail");

    await fetchResult(
      variableValues,
      getContext({ user: senderUser, idempotentKey })
    );

    expect(emailSpy).toHaveBeenCalledWith({
      subject: "[Bank] Transação recebida!",
      template: TransactionReceivedTemplate,
      to: receiverUser.email,
      senderName: senderUser.fullName,
      value: "10.0",
    });
  });
});
