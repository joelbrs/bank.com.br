import { Maybe } from "@repo/types/index";
import mongoose, { Document } from "mongoose";

export type AuthenticationLink = {
  code: string;
  userTaxId: string;
  createdAt: Date;
  updatedAt: Date;

  isExpired(date: Date): boolean;
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

AuthenticationLinkSchema.methods = {
  isExpired(date: Date) {
    const timestamp = date.getTime();

    return Math.abs(Date.now() - timestamp) > 86400000; //one day
  },
};

export const AuthenticationLinkModel =
  mongoose.model<AuthenticationLinkDocument>(
    "AuthenticationLink",
    AuthenticationLinkSchema
  );
