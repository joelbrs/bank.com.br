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

    ctx.cookies.set("bank.auth.token", token, {
      domain: undefined, //TODO: set domain production,
      httpOnly: true,
      sameSite: true,
      path: "/",
      maxAge: 86400 * 7,
    });

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
