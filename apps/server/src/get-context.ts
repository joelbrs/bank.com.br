import { Maybe } from "../../../packages/types/src";
import { getDataloaders } from "./modules/loader";
import { UserDocument } from "./modules/user";
import { ParameterizedContext } from "koa";

interface ContextVars {
  ctx?: ParameterizedContext;
  user: Maybe<UserDocument>;
}

export const getContext = async ({ ctx, user }: ContextVars) => {
  const dataloaders = getDataloaders();

  return {
    ctx,
    dataloaders,
    user,
  } as const;
};
