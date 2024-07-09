import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { timestampResolver } from "@entria/graphql-mongo-helpers";
import { globalIdField } from "graphql-relay";
import { User } from "./user-model";

export const UserType = new GraphQLObjectType<User>({
  name: "User",
  description: "User object that represents Bank users",
  fields: () => ({
    id: globalIdField("User"),
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
