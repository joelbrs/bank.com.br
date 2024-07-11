import { nodeField, nodesField } from "../modules/node";
import { UserLoader, UserModel, UserType } from "../modules/user";
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionArgs, globalIdField } from "graphql-relay";
import { isValidObjectId } from "mongoose";
import { EntityNotFoundException, UnauthorizedException } from "../exceptions";
import { AccountType } from "../modules/account/account-type";
import { Account, AccountModel } from "../modules/account";
import { AccountLoader } from "../modules/account/account-loader";
import {
  TransactionConnection,
  TransactionLoader,
  TransactionType,
} from "@/modules/transaction";
import { withFilter } from "@entria/graphql-mongo-helpers";

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
      resolve: async (_, __, ctx: any) => {
        const userId = ctx.user?._id;

        if (!isValidObjectId(userId)) {
          throw new UnauthorizedException();
        }

        const user = await UserLoader.load(ctx, userId?.toString());

        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
      },
    },
    account: {
      type: AccountType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, __, ctx: any) => {
        const { _id, taxId } = ctx.user;

        if (!isValidObjectId(_id)) {
          throw new UnauthorizedException();
        }

        const account: Account | null = await AccountModel.findOne({
          userTaxId: taxId,
        });

        if (!account) {
          throw new EntityNotFoundException("Conta");
        }

        return await AccountLoader.load(ctx, account._id as string);
      },
    },
    transactions: {
      type: TransactionConnection.connectionType,
      args: {
        _id: {
          type: GraphQLString,
        },
        ...connectionArgs,
      },
      resolve: async (_, _args, ctx: any) => {
        const { _id } = ctx.user;

        if (!isValidObjectId(_id)) {
          throw new UnauthorizedException();
        }

        const user = await UserModel.findById(_id);

        const transactionsArgs = withFilter(_args, {
          senderTaxId: user?.taxId,
        });

        return await TransactionLoader.loadAll(ctx, transactionsArgs);
      },
    },
    transaction: {
      type: TransactionType,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, args, ctx: any) => {
        const { _id } = ctx.user;

        if (!isValidObjectId(_id)) {
          throw new UnauthorizedException();
        }

        const transaction = await TransactionLoader.load(
          ctx,
          args?._id as string
        );
        return transaction;
      },
    },
  }),
});
