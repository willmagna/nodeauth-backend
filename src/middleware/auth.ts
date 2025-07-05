import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401).json({ message: "You are not logged in" });
    return;
  }

  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  if (!ACCESS_SECRET) {
    res.status(500).json({ message: "Secrets environment not found" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.user = decoded;
    next();
  });
}

export function authorizeRoles(...rolesAllowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!rolesAllowed.includes(userRole)) return res.sendStatus(403);
    next();
  };
}
