import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Context } from "koa";
import { UserModel } from "../user-model";
import {
  BusinessRuleException,
  EntityNotFoundException,
  UnauthorizedException,
} from "../../../exceptions";
import { successField } from "@entria/graphql-mongo-helpers";
import { setCookies } from "../../../authentication";

export type LoginPasswordAccessInput = {
  taxId: string;
  password: string;
};

export const LoginPasswordAccessMutation = mutationWithClientMutationId({
  name: "LoginPasswordAccess",
  inputFields: {
    taxId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { password, taxId }: LoginPasswordAccessInput,
    ctx: Context
  ) => {
    const user = await UserModel.findOne({ taxId });

    if (!user) {
      throw new EntityNotFoundException("Usuário");
    }

    if (!user.confirmed) {
      throw new BusinessRuleException(
        "O usuário não está ativo. Ative sua conta através do link de confirmação enviado por e-mail para prosseguir."
      );
    }

    const passwordMatches = await user.comparePassword(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const token = user.generateJwt(user);
    setCookies(ctx.ctx, token);

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
