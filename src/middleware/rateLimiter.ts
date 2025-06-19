import { Request, Response, NextFunction } from "express";
import redisClient from "../lib/redisClient.js";

export function rateLimiter(
  prefix: string,
  limit: number,
  windowInSeconds: number
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip =
        req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      const key = `rate-limit:${prefix}:${ip}`;

      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.expire(key, windowInSeconds);
      }

      const ttl = await redisClient.ttl(key);

      // Set rate limit info in response headers
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, limit - current));
      res.setHeader("X-RateLimit-Reset", ttl);

      if (current > limit) {
        res.status(429).json({
          message: `Too many requests on ${prefix}. Please try again later.`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error(`Rate limiter error for ${prefix}:`, error);
      next();
    }
  };
}
