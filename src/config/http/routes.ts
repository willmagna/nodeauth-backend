import express from "express";
import { authRouter } from "@/modules/auth/routes/index.js";
import { apiTokenAuth } from "./middlewares/apiTokenAuth.js";

export const setupRoutes = (app: express.Express): void => {
  // if will use the authentication in a separate server
  app.use("/auth", apiTokenAuth, authRouter);
  // if will use the authentication in the same server
  // app.use("/auth", authRouter);
};
