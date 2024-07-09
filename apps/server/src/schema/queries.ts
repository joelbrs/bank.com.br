import { GraphQLObjectType } from "graphql";

export const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root queries",
  fields: () => ({}),
});
