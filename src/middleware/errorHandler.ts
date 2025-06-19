import { NextFunction, Request, Response } from "express";
import logger from "@/lib/logger.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err, "Global Error Handler");

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    status: statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
