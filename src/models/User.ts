import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }, // e.g., "user" or "admin"
  refreshToken: String,
});

export default mongoose.model("User", userSchema);
