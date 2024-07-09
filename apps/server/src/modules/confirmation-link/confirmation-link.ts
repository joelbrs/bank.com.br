import { Document, Model, Schema, model } from "mongoose";

export interface IConfirmationLink extends Document {
  code: string;
  userTaxId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

type ConfirmationLinkModel = Model<IConfirmationLink>;

const ConfirmationLinkSchema = new Schema<
  IConfirmationLink,
  ConfirmationLinkModel
>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    userTaxId: {
      type: Schema.Types.ObjectId,
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

export const ConfirmationLink: ConfirmationLinkModel = model<
  IConfirmationLink,
  ConfirmationLinkModel
>("ConfirmationLink", ConfirmationLinkSchema);
