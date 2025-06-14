import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_EXPIRES_IN = "10m"; // short for testing
const REFRESH_EXPIRES_IN = "1h";

// Register
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.json({ message: "User registered successfully" });
});

// Login
router.post("/login", async (req, res): Promise<any> => {
  if (!ACCESS_SECRET || !REFRESH_SECRET)
    return res.status(500).json({ message: "Secrets environment not found" });

  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (
    !user ||
    !(user.password && (await bcrypt.compare(password, user.password)))
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  user.refreshToken = refreshToken;
  await user.save();

  res.json({ accessToken, refreshToken });
});

router.post("/refresh", async (req, res): Promise<any> => {
  if (!ACCESS_SECRET || !REFRESH_SECRET)
    return res.status(500).json({ message: "Secrets environment not found" });

  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401); // Unauthorize

  const user = await User.findOne({ refreshToken });
  if (!user) return res.sendStatus(403); // Forbidden

  jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden

    const newAccessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });
  });
});

router.post("/logout", async (req, res): Promise<any> => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(404);
  await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
  res.json({ messge: "Logged out" });
});

export const authRouter = router;
