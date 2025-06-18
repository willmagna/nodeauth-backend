import { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("🔥 Global Error Handler:", err);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    status: statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
