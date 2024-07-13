import { Maybe } from "@repo/types/index";
import mongoose, { Decimal128, Document } from "mongoose";
import { randomUUID } from "node:crypto";

export type Account = {
  accountNumber: string;
  userTaxId: string;
  balance: Decimal128;
  createdAt: Date;
  updatedAt: Date;

  sufficientFunds(amount: string): boolean;
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
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: new mongoose.Types.Decimal128("0.0"),
    },
  },
  {
    collection: "Account",
    timestamps: true,
  }
);

AccountSchema.methods = {
  sufficientFunds(amount: string) {
    return mongoose.Types.Decimal128.fromString(amount) <= this.balance;
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
