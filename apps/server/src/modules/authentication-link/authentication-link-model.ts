import { Maybe } from "@repo/types/index";
import mongoose, { Document } from "mongoose";

export type AuthenticationLink = {
  code: string;
  userTaxId: string;
  createdAt: Date;
  updatedAt: Date;
} & Document;

type AuthenticationLinkDocument = Maybe<Document> & AuthenticationLink;

const AuthenticationLinkSchema = new mongoose.Schema<AuthenticationLink>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    userTaxId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "AuthLink",
    timestamps: true,
  }
);

export const AuthenticationLinkModel =
  mongoose.model<AuthenticationLinkDocument>(
    "AuthenticationLink",
    AuthenticationLinkSchema
  );
