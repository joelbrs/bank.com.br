import { Maybe } from "../../../packages/types/src";
import { getDataloaders } from "./modules/loader";
import { UserDocument } from "./modules/user";
import { ParameterizedContext } from "koa";

interface ContextVars {
  ctx?: ParameterizedContext;
  user: Maybe<UserDocument>;
  idempotentKey?: string;
}

export const getContext = async ({ ctx, user, idempotentKey }: ContextVars) => {
  const dataloaders = getDataloaders();

  return {
    ctx,
    dataloaders,
    user,
    idempotentKey: idempotentKey || ctx?.request.headers["idempotentkey"],
  } as const;
};
