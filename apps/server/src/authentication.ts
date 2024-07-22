import { Context, ParameterizedContext } from "koa";
import { env } from "./config";
import jwt from "jsonwebtoken";
import { UserModel } from "./modules/user";

export const setCookies = (ctx: Context, token: string) => {
  ctx.cookies.set("bank.auth.token", token, {
    domain: (env.NODE_ENV === "production" && "bank.joelf.tech") || undefined,
    httpOnly: true,
    sameSite: true,
    path: "/",
    maxAge: 86400 * 7, // 7 days,
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

export const getUserByContext = async (ctx: ParameterizedContext) => {
  const token = ctx.cookies.get("bank.auth.token");

  try {
    const { subId } = validateJwt(token as string);

    const user = await UserModel.findById(subId);
    return { user };
  } catch {
    return {
      user: null,
    };
  }
};
