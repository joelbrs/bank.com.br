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
  receiverAccountNumber: string;
  value: string;
};

export const CreateTransactionMutation = mutationWithClientMutationId({
  name: "CreateTransaction",
  inputFields: {
    receiverAccountNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { receiverAccountNumber, value }: CreateTransactionInput,
    ctx
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { idempotentKey, user } = await ctx;

      if (!idempotentKey) {
        throw new BusinessRuleException("A chave de idempotência é inválida.");
      }

      const senderAccount = await AccountModel.findOne({
        userTaxId: user?.taxId,
      }).session(session);

      if (!senderAccount?.sufficientFunds(value)) {
        throw new BusinessRuleException(
          "Saldo insuficiente para efetuar a transação."
        );
      }

      const receiverAccount = await AccountModel.findOne({
        accountNumber: receiverAccountNumber,
      }).session(session);

      if (!receiverAccount) {
        throw new EntityNotFoundException("Conta");
      }

      const existingTransaction = await TransactionModel.findOne({
        idempotentKey,
        senderAccountId: senderAccount?._id,
      }).session(session);

      if (existingTransaction) {
        return {
          transactionId: existingTransaction?._id,
        };
      }

      await AccountModel.updateOne(
        {
          _id: senderAccount?._id,
        },
        {
          $inc: { balance: mongoose.Types.Decimal128.fromString(`-${value}`) },
        },
        { session }
      );

      await AccountModel.updateOne(
        {
          _id: receiverAccount?._id,
        },
        {
          $inc: { balance: mongoose.Types.Decimal128.fromString(value) },
        },
        { session }
      );

      const { _id: transactionId } = await new TransactionModel({
        senderAccountId: senderAccount._id,
        receiverAccountId: receiverAccount._id,
        value,
        idempotentKey,
      }).save();

      await session.commitTransaction();
      return {
        transactionId,
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  },
  outputFields: {
    transactionId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload) => (await payload)?.transactionId,
      ...successField,
    },
  },
});
