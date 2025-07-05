import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import mongoose from "mongoose";
import { usersRouter } from "./routes/users.js";
import { globalRateLimiter } from "./middleware/globalRateLimiter.js";
import cookieParser from "cookie-parser";

mongoose.connect(
  "mongodb://root:examplepassword@localhost:27017/authDB?authSource=admin"
);

const app = express();

app.use(express.json());
app.use(cookieParser());

// Allow frontend on port 3000
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.use(globalRateLimiter);

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
