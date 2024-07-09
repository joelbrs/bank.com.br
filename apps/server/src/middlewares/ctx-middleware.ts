import { Context, Next } from "koa";

export const contextMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get("bank.auth.token");

  ctx.state.context = {
    cookies: ctx.cookies,
    token,
  };
  await next();
};
