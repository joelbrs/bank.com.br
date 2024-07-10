import { nodeField, nodesField } from "../modules/node";
import { UserLoader, UserType } from "../modules/user";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { connectionArgs, globalIdField } from "graphql-relay";
import { isValidObjectId } from "mongoose";
import { UnauthorizedException } from "@/exceptions";

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
  }),
});
