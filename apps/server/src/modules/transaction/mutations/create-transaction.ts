import {
  BusinessRuleException,
  EntityNotFoundException,
  UnauthorizedException,
} from "../../../exceptions";
import { AccountModel } from "../../account";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import mongoose from "mongoose";
import { TransactionModel } from "../transaction-model";
import { successField } from "@entria/graphql-mongo-helpers";
import { sendEmail, TransactionReceivedTemplate } from "../../../notification";
import { User, UserModel } from "../../../modules/user";

export type CreateTransactionInput = {
  receiverAccountNumber: string;
  value: string;
  description?: string;
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
    description: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (
    { receiverAccountNumber, value, description }: CreateTransactionInput,
    ctx
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { idempotentKey, user } = await ctx;

      if (!user) {
        throw new UnauthorizedException();
      }

      if (!idempotentKey) {
        throw new BusinessRuleException("A chave de idempotência é inválida.");
      }

      const senderAccount = await AccountModel.findOne({
        userTaxId: user?.taxId,
      }).session(session);

      if (receiverAccountNumber === senderAccount?.accountNumber?.toString()) {
        throw new BusinessRuleException(
          "Não é possível realizar transações entre a mesma conta."
        );
      }

      if (+value === 0) {
        throw new BusinessRuleException("Valor inválido.");
      }

      if (!(await senderAccount?.sufficientFunds(value))) {
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
        receiverAccountId: receiverAccount?._id,
      }).session(session);

      if (existingTransaction) {
        return {
          transactionId: existingTransaction?._id,
        };
      }

      const { _id: transactionId } = await new TransactionModel({
        senderAccountId: senderAccount?._id,
        receiverAccountId: receiverAccount._id,
        value,
        idempotentKey,
        description,
      }).save();

      const receiverUser = await UserModel.findOne({
        taxId: receiverAccount.userTaxId,
      });

      await sendEmail({
        subject: "[Bank] Transação recebida!",
        template: TransactionReceivedTemplate,
        to: (receiverUser as User).email,
        senderName: user.fullName,
        value,
      });

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
