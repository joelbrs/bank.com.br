import { GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";

export const Query = new GraphQLObjectType({
  name: "Query",
  description: "Root queries",
  fields: () => ({
    id: globalIdField("Query"),
    version: {
      type: GraphQLString,
      resolve: () => "1.0.0",
    },
  }),
});
