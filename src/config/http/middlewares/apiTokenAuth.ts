import { API_KEY } from "@/config/env/env.js";
import logger from "@/lib/logger.js";
import { AppError } from "@/utils/AppError.js";
import { Request, Response, NextFunction } from "express";

export function apiTokenAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!authHeader?.startsWith("Bearer ")) {
    logger.warn(`authMiddleware - ${ip} - Unauthorized`);
    throw new AppError(401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  if (API_KEY != token) {
    logger.warn(`authMiddleware - ${ip} - Unauthorized`);
    throw new AppError(401, "Unauthorized");
  }

  next();
}
