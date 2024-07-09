import { UserMutations } from "../modules/user";
import { GraphQLObjectType } from "graphql";

export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutations",
  fields: () => ({
    ...UserMutations,
  }),
});
