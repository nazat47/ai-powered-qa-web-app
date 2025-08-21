import mongoose, { Schema } from "mongoose";

export interface UserAttrs {
  name: string;
  email: string;
  password: string;
}

export interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

export const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
