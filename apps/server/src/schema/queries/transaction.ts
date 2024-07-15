import { UnauthorizedException } from "@/exceptions";
import { AccountModel } from "@/modules/account";
import { TransactionLoader } from "@/modules/transaction";
import { UserModel } from "@/modules/user";
import { withFilter } from "@entria/graphql-mongo-helpers";
import { GraphQLFieldConfigArgumentMap } from "graphql";
import { isValidObjectId } from "mongoose";

export const getTransactionById = async (ctx: any, _id: string) => {
  if (!ctx.user) {
    throw new UnauthorizedException();
  }

  const { _id: userId } = ctx.user;

  if (!isValidObjectId(userId)) {
    throw new UnauthorizedException();
  }

  const transaction = await TransactionLoader.load(ctx, _id as string);
  return transaction;
};

export const getUserTransactions = async (
  ctx: any,
  _args: GraphQLFieldConfigArgumentMap
) => {
  if (!ctx.user) {
    throw new UnauthorizedException();
  }

  const { _id } = ctx.user;

  if (!isValidObjectId(_id)) {
    throw new UnauthorizedException();
  }

  const user = await UserModel.findById(_id);

  const userAccount = await AccountModel.findOne({
    userTaxId: user?.taxId,
  });

  const transactionsArgs = withFilter(_args, {
    senderAccountId: userAccount?._id,
  });

  return await TransactionLoader.loadAll(ctx, transactionsArgs);
};
