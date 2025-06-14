import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import mongoose from "mongoose";
import { authMiddleware, authorizeRoles } from "./middleware/auth.js";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://root:examplepassword@localhost:27017");

app.use("/auth", authRouter);

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
});

app.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin content" });
});
app.listen(4000, () => console.log("Server running on http://localhost:4000"));
