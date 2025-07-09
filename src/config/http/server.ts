import "dotenv/config";
import "reflect-metadata";
import express from "express";

import mongoose from "mongoose";
import { errorHandler } from "./middlewares/errorHandler.js";
import logger from "../../lib/logger.js";
import { BACK_END_BASE_URL, MONGODB_URI, PORT } from "../env/env.js";
import { setupMiddlewares } from "./middlewares/setup.js";
import { setupRoutes } from "./routes.js";

const app = express();

setupMiddlewares(app);
setupRoutes(app);

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
