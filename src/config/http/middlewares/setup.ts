import express from "express";
import { corsSetup } from "./cors.js";
import cookieParser from "cookie-parser";
import { globalRateLimiter } from "./globalRateLimiter.js";

export const setupMiddlewares = (app: express.Express): void => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(corsSetup);
  app.use(globalRateLimiter);
};
