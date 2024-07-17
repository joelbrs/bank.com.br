import { Maybe } from "@repo/types/index";
import mongoose, { Document } from "mongoose";
import { randomUUID } from "node:crypto";
import { getBalance } from "./utils";

export type Account = {
  accountNumber: string;
  userTaxId: string;
  createdAt: Date;
  updatedAt: Date;

  sufficientFunds(amount: string): Promise<boolean>;
  generateAccountNumber(): string;
} & Document;

type AccountDocument = Maybe<Document> & Account;

const AccountSchema = new mongoose.Schema<Account>(
  {
    accountNumber: {
      type: String,
      unique: true,
    },
    userTaxId: {
      type: String,
      ref: "User",
      unique: true,
      required: true,
    },
  },
  {
    collection: "Account",
    timestamps: true,
  }
);

AccountSchema.methods = {
  async sufficientFunds(amount: string) {
    const balance = await getBalance(this._id as string);
    return Number(balance) >= Number(amount);
  },
  generateAccountNumber() {
    const uuid = randomUUID();

    return BigInt(`0x${uuid.replace(/-/g, "")}`)
      .toString()
      .slice(0, 7);
  },
};

AccountSchema.pre<AccountDocument>("save", function () {
  if (this.isModified("userTaxId")) {
    this.accountNumber = this.generateAccountNumber();
  }
});

export const AccountModel = mongoose.model<AccountDocument>(
  "Account",
  AccountSchema
);
