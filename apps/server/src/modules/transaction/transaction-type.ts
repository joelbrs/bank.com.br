import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Transaction } from "./transaction-model";
import { AccountType } from "../account/account-type";
import { AccountModel } from "../account";
import { connectionDefinitions } from "@entria/graphql-mongo-helpers";
import { Load, registerTypeLoader } from "../node";
import { AccountLoader } from "../account/account-loader";

export const TransactionType = new GraphQLObjectType<Transaction>({
  name: "Transaction",
  description: "Transaction object that represents accounts transactions",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents transaction's id",
    },
    value: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents transaction's value",
      resolve: ({ value }) => `${value}`,
    },
    sender: {
      type: new GraphQLNonNull(AccountType),
      description: "Represents transaction's sender",
      resolve: async ({ senderAccountId }) => {
        const account = await AccountModel.findById(senderAccountId);
        return account;
      },
    },
    receiver: {
      type: new GraphQLNonNull(AccountType),
      description: "Represents transaction's sender",
      resolve: async ({ receiverAccountId }) => {
        const account = await AccountModel.findById(receiverAccountId);
        return account;
      },
    },
  }),
});

export const TransactionConnection = connectionDefinitions({
  name: "TransactionConnection",
  nodeType: TransactionType,
});

registerTypeLoader(AccountType, AccountLoader.load as Load);
