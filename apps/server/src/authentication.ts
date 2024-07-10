import { Context } from "koa";
import { env } from "./config";
import jwt from "jsonwebtoken";

export const setCookies = (ctx: Context, token: string) => {
  ctx.cookies.set("bank.auth.token", token, {
    domain: undefined, //TODO: set domain production,
    httpOnly: true,
    sameSite: true,
    path: "/",
    maxAge: 30 * 60 * 1000, // 30min,
  });
};

export const validateJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_KEY);
    return decoded as { subId: string };
  } catch {
    throw new Error("Invalid token.");
  }
};
