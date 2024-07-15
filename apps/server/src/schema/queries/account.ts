import {
  EntityNotFoundException,
  UnauthorizedException,
} from "../../exceptions";
import { Account, AccountLoader, AccountModel } from "../../modules/account";
import { isValidObjectId } from "mongoose";

type Filters = {
  accountNumber?: string | number;
};

export const getAccount = async (ctx: any, args: Filters) => {
  if (!ctx.user) {
    throw new UnauthorizedException();
  }

  const { _id, taxId } = ctx.user;

  if (!isValidObjectId(_id)) {
    throw new UnauthorizedException();
  }

  let account: Account | null;

  if (args.accountNumber) {
    account = await AccountModel.findOne({
      accountNumber: args.accountNumber,
    });
  } else {
    account = await AccountModel.findOne({
      userTaxId: taxId,
    });
  }

  if (!account) {
    throw new EntityNotFoundException("Conta");
  }

  return await AccountLoader.load(ctx, account._id as string);
};
