import { Request, Response, NextFunction } from "express";
import redisClient from "../../../lib/redisClient.js";
import { MAX_REQUESTS, WINDOW_IN_SECONDS } from "../../env/env.js";

export async function globalRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const key = `rate-limit:${ip}`;

    const current = await redisClient.incr(key);

    if (current === 1) {
      // If it is the first request -> set expiration for the key
      await redisClient.expire(key, WINDOW_IN_SECONDS);
    }

    const ttl = await redisClient.ttl(key);

    // Set rate limit info in response headers
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - current));
    res.setHeader("X-RateLimit-Reset", ttl);

    if (current > MAX_REQUESTS) {
      res.status(429).json({
        message: "Too many requests",
        retryAfterSeconds: ttl,
      });
      return;
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next(); // Allow request if Redis fails (optional: block instead)
  }
}
