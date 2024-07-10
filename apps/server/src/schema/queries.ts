import { nodeField, nodesField } from "../modules/node";
import { UserLoader, UserType } from "../modules/user";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { connectionArgs, globalIdField } from "graphql-relay";
import { isValidObjectId } from "mongoose";
import { EntityNotFoundException, UnauthorizedException } from "../exceptions";
import { AccountType } from "../modules/account/account-type";
import { Account, AccountModel } from "../modules/account";
import { AccountLoader } from "../modules/account/account-loader";

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
  }),
});
