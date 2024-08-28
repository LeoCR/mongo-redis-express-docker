import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = model("User", UserSchema);
export default UserModel;
