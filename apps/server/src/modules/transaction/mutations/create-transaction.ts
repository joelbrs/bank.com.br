import {
  BusinessRuleException,
  EntityNotFoundException,
} from "../../../exceptions";
import { AccountModel } from "../../account";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import mongoose from "mongoose";
import { TransactionModel } from "../transaction-model";
import { successField } from "@entria/graphql-mongo-helpers";

export type CreateTransactionInput = {
  receiverTaxId: string;
  value: string;
};

export const CreateTransactionMutation = mutationWithClientMutationId({
  name: "CreateTransaction",
  inputFields: {
    receiverTaxId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { receiverTaxId, value }: CreateTransactionInput,
    ctx
  ) => {
    const { idempotentKey, user } = await ctx;

    if (!idempotentKey) {
      throw new BusinessRuleException("A chave de idempotência é inválida.");
    }

    const existsTransaction = await TransactionModel.findOne({ idempotentKey });

    if (existsTransaction) {
      return {
        transactionId: existsTransaction?._id,
      };
    }

    const senderAccount = await AccountModel.findOne({
      userTaxId: user?.taxId,
    });

    if (!senderAccount?.sufficientFunds(value)) {
      throw new BusinessRuleException(
        "Saldo insuficiente para efetuar a transação."
      );
    }

    const receiverAccount = await AccountModel.findOne({
      userTaxId: receiverTaxId,
    });

    if (!receiverAccount) {
      throw new EntityNotFoundException("Conta");
    }

    await AccountModel.findByIdAndUpdate(senderAccount._id, {
      $inc: { balance: mongoose.Types.Decimal128.fromString(`-${value}`) },
    });

    await AccountModel.findByIdAndUpdate(receiverAccount._id, {
      $inc: { balance: mongoose.Types.Decimal128.fromString(value) },
    });

    const transaction = await TransactionModel.create({
      senderTaxId: senderAccount.userTaxId,
      receiverTaxId: receiverAccount.userTaxId,
      value,
      idempotentKey,
    });

    return {
      transactionId: transaction?._id,
    };
  },
  outputFields: {
    transactionId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload) => (await payload)?.transactionId,
      ...successField,
    },
  },
});
