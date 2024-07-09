import { Maybe } from "@repo/types/index";
import mongoose, { Document } from "mongoose";

export interface ConfirmationLink extends Document {
  code: string;
  userTaxId: string;
  createdAt: Date;
  updatedAt: Date;
}

type ConfirmationLinkDocument = Maybe<Document> & ConfirmationLink;

const ConfirmationLinkSchema = new mongoose.Schema<ConfirmationLinkDocument>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    userTaxId: {
      type: String,
      ref: "User",
      unique: true,
      required: true,
    },
  },
  {
    collection: "ConfirmationLink",
    timestamps: true,
  }
);

export const ConfirmationLinkModel = mongoose.model<ConfirmationLink>(
  "ConfirmationLink",
  ConfirmationLinkSchema
);
