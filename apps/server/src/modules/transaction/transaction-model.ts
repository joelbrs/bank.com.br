import { Maybe } from "@repo/types/index";
import mongoose, { Decimal128, Document } from "mongoose";

export type Transaction = {
  senderAccountId: mongoose.Schema.Types.ObjectId;
  receiverAccountId: mongoose.Schema.Types.ObjectId;
  idempotentKey: string;
  value: Decimal128;
  description?: string;
  createdAt: Date;
  updated: Date;
} & Document;

type TransactionDocument = Maybe<Document> & Transaction;

const TransactionSchema = new mongoose.Schema<Transaction>(
  {
    senderAccountId: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    idempotentKey: {
      type: String,
      required: true,
    },
    receiverAccountId: {
      type: mongoose.Types.ObjectId,
      ref: "Account",
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

TransactionSchema.index(
  { senderAccountId: 1, idempotentKey: 1, receiverAccountId: 1 },
  { unique: true }
);

export const TransactionModel = mongoose.model<TransactionDocument>(
  "Transaction",
  TransactionSchema
);
