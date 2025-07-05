import "dotenv/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mongoose from "mongoose";
import { globalRateLimiter } from "./middleware/globalRateLimiter.js";
import { authRouter } from "./modules/auth/routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./lib/logger.js";
import { BACK_END_BASE_URL, MONGODB_URI, PORT } from "./config/env.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(globalRateLimiter);

app.use("/auth", authRouter);

app.use(errorHandler);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info("MongoDB Database Connected");
    app.listen(PORT, () =>
      logger.info(`Server running on ${BACK_END_BASE_URL}`)
    );
  })
  .catch((err) => {
    logger.error(err, "MongoDB Connection Error");
    logger.error(err, "Server is not running");
    throw err;
  });
