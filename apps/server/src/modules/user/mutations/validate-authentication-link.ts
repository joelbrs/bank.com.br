import { UnauthorizedException } from "../../../exceptions";
import { AuthenticationLinkModel } from "../../authentication-link";
import { setCookies } from "../../../authentication";
import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { successField } from "@entria/graphql-mongo-helpers";
import { Context } from "koa";
import { UserModel } from "..";

export type ValidateAuthenticationLinkInput = {
  code: string;
  redirect: string;
};

export const ValidateAuthenticationLinkMutation = mutationWithClientMutationId({
  name: "ValidateAuthenticationLink",
  inputFields: {
    code: {
      type: new GraphQLNonNull(GraphQLString),
    },
    redirect: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { code }: ValidateAuthenticationLinkInput,
    ctx: Context
  ) => {
    const authLinkFromCode = await AuthenticationLinkModel.findOne({ code });

    if (!authLinkFromCode) {
      throw new UnauthorizedException();
    }

    if (authLinkFromCode.isExpired(authLinkFromCode.createdAt)) {
      await authLinkFromCode.deleteOne({ code });
      throw new UnauthorizedException();
    }

    const user = await UserModel.findOne({ taxId: authLinkFromCode.userTaxId });

    if (!user) {
      throw new UnauthorizedException();
    }

    const token = user?.generateJwt(user);
    setCookies(ctx.ctx, token);

    await authLinkFromCode.deleteOne({ code });
    return {
      userId: user._id,
    };
  },
  outputFields: {
    userId: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: async (payload) => (await payload)?.userId,
      ...successField,
    },
  },
});
