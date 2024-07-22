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
import { createHash } from "crypto";
import { redis } from "../../../redis";

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
      const { user } = await ctx;

      if (!user) {
        throw new UnauthorizedException();
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

      const dataToBeHashed = `${senderAccount?._id}-${receiverAccount?._id}-${value}-${description}`;

      const idempotentKey = createHash("sha256")
        .update(dataToBeHashed)
        .digest("hex");

      const existingTransaction = await redis.set(
        idempotentKey,
        "transaction",
        "EX",
        60 * 5,
        "GET"
      );

      if (existingTransaction) {
        throw new BusinessRuleException(
          "Não é possível gerar transações idênticas consecutivamente. Tente novamente mais tarde."
        );
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
