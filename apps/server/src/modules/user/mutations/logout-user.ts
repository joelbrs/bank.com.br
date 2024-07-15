import { UnauthorizedException } from "../../../exceptions";
import { successField } from "@entria/graphql-mongo-helpers";
import { GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

export const LogoutUserMutation = mutationWithClientMutationId({
  name: "Logout",
  inputFields: {},
  mutateAndGetPayload: (_, ctx) => {
    if (!ctx.user) {
      throw new UnauthorizedException();
    }
    ctx.ctx.cookies.set("bank.auth.token", undefined);

    return {
      message: "Operação realizada com sucesso!",
    };
  },
  outputFields: {
    message: {
      type: GraphQLString,
      resolve: async (payload) => (await payload)?.message,
      ...successField,
    },
  },
});
