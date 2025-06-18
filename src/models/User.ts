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
      // require: [true, "Password must be provided!"],
      trim: true,
      select: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
