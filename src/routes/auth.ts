import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redisClient from "../services/redisClient.js";
import { sendRecoveryEmail } from "../services/mail.js";
import { VerifyErrors } from "jsonwebtoken";
import { Request, Response } from "express";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const ACCESS_EXPIRES_IN = "1m"; // short for testing
const REFRESH_EXPIRES_IN = "3m";

// # REGISTER
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, role });

  try {
    const result = await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json(error);
    console.error(error);
    return;
  }
});

// # LOGIN
router.post(
  "/login",
  // rateLimiter("login", 10, 60),
  async (req: Request, res: Response): Promise<void> => {
    console.log("/auth/login");
    if (!ACCESS_SECRET || !REFRESH_SECRET) {
      res.status(500).json({ message: "Secrets environment not found" });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      !(user.password && (await bcrypt.compare(password, user.password)))
    ) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS - Activates SSL
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      accessToken,
    });
  }
);

// # REFRESH
router.post(
  "/refresh-token",
  async (req: Request, res: Response): Promise<void> => {
    console.log("/auth/refresh-token");

    if (!ACCESS_SECRET || !REFRESH_SECRET) {
      res.status(500).json({ message: "Secrets environment not found" });
      return;
    }

    const { refreshToken } = req.cookies;

    // console.log(refreshToken);

    if (!refreshToken) {
      res.sendStatus(401); // Unauthorize
      return;
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.sendStatus(401); // Unauthorized
      return;
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err: any, decoded: any) => {
      if (err) return res.sendStatus(401); // Unauthorized

      const newAccessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
      );

      res.json({
        id: user._id,
        email: user.email,
        role: user.role,
        accessToken: newAccessToken,
      });
    });
  }
);

// # LOGOUT

router.post("/logout", async (req: Request, res: Response): Promise<void> => {
  console.log("/auth/logout");
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.sendStatus(404);
    return;
  }

  try {
    await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
  } catch (error) {
    console.error(error);
    return;
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.json({ messge: "Logged out" });
});

// FORGOT PASSWORD

router.post(
  "/forgot-password",
  rateLimiter("forgot-password", 5, 600),
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `recover:${email}`;

    await redisClient.set(key, code, { EX: 900 }); // 15 minutes expiration

    sendRecoveryEmail(email, code);

    res.json({ message: "Recovery code sent to your email" });
  }
);

// # RESET PASSWORD

router.post(
  "/reset-password",
  rateLimiter("reset-password", 5, 600),
  async (req: Request, res: Response): Promise<void> => {
    const { email, code, newPassword } = req.body;

    const key = `recover:${email}`;
    const storedCode = await redisClient.get(key);

    if (!storedCode) {
      res
        .status(400)
        .json({ message: "No recovery code found or code expired" });
      return;
    }

    if (storedCode !== code) {
      res.status(400).json({ message: "Invalid recovery code" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();
    await redisClient.del(key);

    res.json({ message: "Password has been reset successfully" });
  }
);

export const authRouter = router;
