import { UnauthorizedException } from "@/exceptions";
import { UserLoader } from "@/modules/user";
import { isValidObjectId } from "mongoose";

export const getUser = async (ctx: any) => {
  const userId = ctx.user?._id;

  if (!isValidObjectId(userId)) {
    throw new UnauthorizedException();
  }

  const user = await UserLoader.load(ctx, userId?.toString());

  if (!user) {
    throw new UnauthorizedException();
  }
  return user;
};
