import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Account } from "./account-model";
import { UserModel, UserType } from "../user";
import { connectionDefinitions } from "graphql-relay";

export const AccountType = new GraphQLObjectType<Account>({
  name: "Account",
  description: "Account object that represents user's account",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents account's id",
    },
    userTaxId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents owner's taxId of account",
    },
    balance: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents account's balance",
    },
    user: {
      type: new GraphQLNonNull(UserType),
      description: "Represents account's owner object",
      resolve: async ({ userTaxId }) => {
        const user = await UserModel.findOne({ taxId: userTaxId });
        return user;
      },
    },
  }),
});

export const AccountConnection = connectionDefinitions({
  name: "AccountConnection",
  nodeType: AccountType,
});
