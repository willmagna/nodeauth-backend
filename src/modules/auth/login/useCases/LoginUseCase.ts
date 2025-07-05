import { injectable, singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User.js";
import { AppError } from "@/utils/AppError.js";
import {
  ACCESS_EXPIRES_IN,
  ACCESS_SECRET,
  REFRESH_EXPIRES_IN,
  REFRESH_SECRET,
} from "@/config/env.js";
import logger from "@/lib/logger.js";

interface LoginRequest {
  email: string;
  password: string;
}

@singleton()
export class LoginUseCase {
  public async execute({ email, password }: LoginRequest) {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }
    if (!(user.password && (await bcrypt.compare(password, user.password)))) {
      throw new AppError(401, "Invalid credentials");
    }
    if (!user.isSuperAdmin && !user.isVerified) {
      throw new AppError(401, "User not verified");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        authorizations: user.authorizations,
        isVerified: user.isVerified,
      },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    user.refreshToken = refreshToken;

    await user.save();

    logger.info(`User ${user._id} has loggedin`);

    return {
      id: user._id,
      email: user.email,
      isSuperAdmin: user.isSuperAdmin,
      authorizations: user.authorizations,
      isVerified: user.isVerified,
      accessToken,
      refreshToken,
    };
  }
}
