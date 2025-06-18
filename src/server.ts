import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import { usersRouter } from "./routes/users.js";
import { globalRateLimiter } from "./middleware/globalRateLimiter.js";
import { authRouter } from "./modules/auth/routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const mongoDBURI =
  process.env.MONGODB_URI ??
  "mongodb://root:examplepassword@localhost:27017/authDB?authSource=admin";

mongoose
  .connect(mongoDBURI)
  .then(() => console.log("MongoDB Database Connected"))
  .catch((err) => console.error(err));

const app = express();
app.use(express.json());
app.use(cors());
app.use(globalRateLimiter);

app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on http://localhost:4000"));
