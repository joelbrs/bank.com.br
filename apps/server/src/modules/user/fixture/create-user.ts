import { DeepPartial } from "@repo/types/index";
import { getCounter } from "../../../../test/counters";
import { User, UserModel } from "../user-model";
import { randomUUID } from "crypto";

export const createUser = async (args?: DeepPartial<User>) => {
  const i = getCounter("user");

  return new UserModel({
    fullName: `user#${i}-${randomUUID()}`,
    taxId: `tax#${i}-${randomUUID().slice(30)}`,
    email: `user@example.com#${i}`,
    password: `password#${i}`,
    ...args,
  }).save();
};
