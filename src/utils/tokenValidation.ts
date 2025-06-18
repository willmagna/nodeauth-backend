import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "fd8b65877836730d63cb764d977e3b8975af1e55a6a8c6341e387f8053e6e11f390389e0c383643bdca1fe996fc637a5724daf890894f88cc48ab9bc";

type CreateTokenInput = {
  obj: Record<string, unknown>;
  expiresIn: string | number;
};

export function createJWToken({ obj, expiresIn }: CreateTokenInput) {
  return jwt.sign(obj, JWT_SECRET, { expiresIn });
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
