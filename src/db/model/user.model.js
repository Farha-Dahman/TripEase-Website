import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 4,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: Object,
    },
    address: {
      type: String,
    },
    cover: {
      type: [String],
    },
    file: {
      type: String,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    sendCode: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
