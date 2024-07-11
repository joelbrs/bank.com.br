import { Maybe } from "@repo/types/index";
import mongoose, { Decimal128, Document } from "mongoose";

export type Transaction = {
  senderTaxId: string;
  receiverTaxId: string;
  value: Decimal128;
  description?: string;
  createdAt: Date;
  updated: Date;
} & Document;

type TransactionDocument = Maybe<Document> & Transaction;

const TransactionSchema = new mongoose.Schema<Transaction>(
  {
    senderTaxId: {
      type: String,
      required: true,
    },
    receiverTaxId: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    collection: "Transaction",
    timestamps: true,
  }
);

export const TransactionModel = mongoose.model<TransactionDocument>(
  "Transaction",
  TransactionSchema
);
