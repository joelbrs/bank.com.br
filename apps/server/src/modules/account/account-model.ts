import { Maybe } from "@repo/types/index";
import mongoose, { Decimal128, Document } from "mongoose";

export type Account = {
  accountNumber: string;
  userTaxId: string;
  balance: Decimal128;
  createdAt: Date;
  updatedAt: Date;
} & Document;

type AccountDocument = Maybe<Document> & Account;

const AccountSchema = new mongoose.Schema<Account>(
  {
    accountNumber: {
      type: String,
      unique: true,
      default: Date.now().toString(),
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

export const AccountModel = mongoose.model<AccountDocument>(
  "Account",
  AccountSchema
);
