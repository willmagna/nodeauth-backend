import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import mongoose from "mongoose";
import { authMiddleware, authorizeRoles } from "./middleware/auth.js";
import { usersRouter } from "./routes/users.js";
import { globalRateLimiter } from "./middleware/globalRateLimiter.js";

mongoose.connect("mongodb://root:examplepassword@localhost:27017");

const app = express();
app.use(express.json());
app.use(cors());
app.use(globalRateLimiter);

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
