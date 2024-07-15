import { nodeField, nodesField } from "../modules/node";
import { UserModel, UserType } from "../modules/user";
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { connectionArgs, globalIdField } from "graphql-relay";
import { isValidObjectId } from "mongoose";
import { UnauthorizedException } from "../exceptions";
import { AccountType } from "../modules/account/account-type";
import { AccountModel } from "../modules/account";
import {
  TransactionConnection,
  TransactionModel,
  TransactionType,
} from "../modules/transaction";
import { MetricsType } from "@/modules/transaction/metrics-types";
import { getUser } from "./queries/user";
import { getAccount } from "./queries/account";
import { getTransactionById, getUserTransactions } from "./queries/transaction";
import { generateMonthlyMetrics, getMonthlyMetrics } from "./queries/metrics";

export const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root queries",
  fields: () => ({
    id: globalIdField("Query"),
    node: nodeField,
    nodes: nodesField,
    version: {
      type: GraphQLString,
      resolve: () => "1.0.0",
    },
    user: {
      type: UserType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, __, ctx) => {
        const user = await getUser(ctx);

        return user;
      },
    },
    account: {
      type: AccountType,
      args: {
        accountNumber: {
          type: GraphQLString,
        },
        ...connectionArgs,
      },
      resolve: async (_, args, ctx) => {
        const account = await getAccount(ctx, args);
        return account;
      },
    },
    transactions: {
      type: TransactionConnection.connectionType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, _args, ctx) => {
        const transactions = await getUserTransactions(ctx, _args);
        return transactions;
      },
    },
    transaction: {
      type: TransactionType,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, args, ctx) => {
        const transaction = await getTransactionById(ctx, args?._id as string);
        return transaction;
      },
    },
    metrics: {
      type: new GraphQLList(MetricsType),
      resolve: async (_, __, ctx: any) => {
        if (!ctx.user) {
          throw new UnauthorizedException();
        }

        const userAccount = await getAccount(ctx, {});
        const metrics = await getMonthlyMetrics(userAccount?._id as string);

        return generateMonthlyMetrics(metrics);
      },
    },
  }),
});
