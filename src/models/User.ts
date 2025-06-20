import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Emails is required"],
      trim: true,
      unique: [true, "Email must be unique"],
      minLength: [5, "Email must have 5 characters!"],
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    authorizations: {
      type: Object,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    metadata: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
