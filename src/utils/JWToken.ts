import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/env/env.js";

type CreateTokenInput = {
  data: Record<string, unknown>;
  options?: jwt.SignOptions;
};

export function createJWToken({ data, options }: CreateTokenInput): string {
  return jwt.sign(data, JWT_SECRET, options);
}

export function parseJWToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { valid: true, expired: false, payload };
  } catch (error) {
    return {
      valid: false,
      expired: error instanceof jwt.TokenExpiredError,
      payload: null,
    };
  }
}
