import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { timestampResolver } from "@entria/graphql-mongo-helpers";
import { Load, registerTypeLoader } from "../node";
import { connectionDefinitions } from "graphql-relay";
import { UserLoader } from "./user-loader";
import { User } from "./user-model";

export const UserType = new GraphQLObjectType<User>({
  name: "User",
  description: "User object that represents Bank users",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents user's id",
    },
    fullName: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents user's full name",
    },
    taxId: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents user's taxId (it can be CPF or CNPJ)",
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents user's password",
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Represents user's email",
    },
    ...timestampResolver,
  }),
});

export const UserConnection = connectionDefinitions({
  name: "UserConnection",
  nodeType: UserType,
});

registerTypeLoader(UserType, UserLoader.load as Load);
