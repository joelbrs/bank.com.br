import { Context } from "koa";

export const setCookies = (ctx: Context, token: string) => {
  ctx.cookies.set("bank.auth.token", token, {
    domain: undefined, //TODO: set domain production,
    httpOnly: true,
    sameSite: true,
    path: "/",
    maxAge: 30 * 60 * 1000, // 30min,
  });
};
