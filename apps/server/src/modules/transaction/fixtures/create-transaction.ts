import { DeepPartial } from "@repo/types/index";
import { Transaction, TransactionModel } from "../transaction-model";
import { randomUUID } from "crypto";

export const createTransaction = async (args: DeepPartial<Transaction>) => {
  return await new TransactionModel({
    senderAccountId: args.senderAccountId,
    receiverAccountId: args.receiverAccountId,
    value: args.value,
    description: args.description,
    idempotentKey: args.idempotentKey || randomUUID(),
  }).save();
};
