import { GraphQLSchema } from "graphql";
import { Mutation } from "./mutations";
import { Query } from "./queries";

export const schema = new GraphQLSchema({
  mutation: Mutation,
  query: Query,
});
