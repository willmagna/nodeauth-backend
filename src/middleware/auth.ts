import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    console.log(decoded);
    next();
  });
}

export function authorizeRoles(...rolesAllowed) {
  console.log("rolesAllowed", rolesAllowed);
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!rolesAllowed.includes(userRole)) return res.sendStatus(403);
    next();
  };
}
