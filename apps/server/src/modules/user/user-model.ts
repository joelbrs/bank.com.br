import mongoose, { Document } from "mongoose";
import { Maybe } from "@repo/types/index";
import { env } from "@/config";
import bcrypt from "bcrypt";

export type User = {
  fullName: string;
  taxId: string;
  password: string;
  email: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;

  hashPassword(password: string): Promise<string>;
} & Document;

type UserDocument = Maybe<Document> & User;

const UserSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      minlength: 10,
      required: true,
    },
    taxId: {
      type: String,
      minlength: 11,
      maxlength: 14,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "User",
    timestamps: true,
  }
);

UserSchema.methods = {
  hashPassword: (password: string) => {
    return bcrypt.hash(password, env.HASH_SALT);
  },
};

UserSchema.pre<UserDocument>("save", async function () {
  if (this.isModified("password")) {
    this.password = await this.hashPassword(this.password);
  }
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);
