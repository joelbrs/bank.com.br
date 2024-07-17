import { DeepPartial } from "@repo/types/index";
import { Account, AccountModel } from "../account-model";

export const createAccount = async (args: DeepPartial<Account>) => {
  return await new AccountModel({
    userTaxId: args.userTaxId,
    ...args,
  }).save();
};
