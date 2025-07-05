import express from "express";
import User from "../models/User.js";
import { authMiddleware, authorizeRoles } from "../middleware/auth.js";
const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  const result = await User.find();
  res.status(200).send(result);
});

router.get("/profile", authMiddleware, (req, res) => {
  console.log("/user/profile");
  // console.log(req.cookies.refreshToken);
  res.json({ message: `Welcome, ${req.user.email}` });
});

router.get("/admin", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin content" });
});

export const usersRouter = router;
