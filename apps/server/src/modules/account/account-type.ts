import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { Account } from "./account-model";
import { UserModel, UserType } from "../user";
import { connectionDefinitions } from "graphql-relay";
import { Load, registerTypeLoader } from "../node";
import { AccountLoader } from "./account-loader";
import { timestampResolver } from "@entria/graphql-mongo-helpers";

export const AccountType = new GraphQLObjectType<Account>({
  name: "Account",
  description: "Account object that represents user's account",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents account's id",
    },
    accountNumber: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents account' number",
    },
    userTaxId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents owner's taxId of account",
    },
    balance: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents account's balance",
      resolve: ({ balance }) => `${balance}`,
    },
    owner: {
      type: new GraphQLNonNull(UserType),
      description: "Represents account's owner object",
      resolve: async ({ userTaxId }) => {
        const user = await UserModel.findOne({ taxId: userTaxId });
        return user;
      },
    },
    ...timestampResolver,
  }),
});

export const AccountConnection = connectionDefinitions({
  name: "AccountConnection",
  nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load as Load);
