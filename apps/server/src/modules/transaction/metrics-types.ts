import { GraphQLInt, GraphQLNonNull, GraphQLObjectType } from "graphql";

export const MetricsType = new GraphQLObjectType({
  name: "Metrics",
  description:
    "Metrics object that represents transactions metrics of an account",
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Represents metric's month",
    },
    total: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Represents metric's sum per month",
    },
    sent: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Represents metric's sent per month",
    },
    received: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "Represents metric's received per month",
    },
  }),
});
