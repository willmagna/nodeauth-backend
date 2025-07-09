import { singleton } from "tsyringe";
import User from "@/models/User.js";
import { AppError } from "@/utils/AppError.js";
import jwt from "jsonwebtoken";
import { RefreshTokenInput } from "../../shared/types.js";
import {
  ACCESS_EXPIRES_IN,
  ACCESS_SECRET,
  REFRESH_SECRET,
} from "@/config/env.js";

@singleton()
export class RefreshTokenUseCase {
  public async execute({ refreshToken }: RefreshTokenInput) {
    if (!refreshToken) {
      throw new AppError(401, "Unauthorized");
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      throw new AppError(401, "Unauthorized");
    }

    return jwt.verify(refreshToken, REFRESH_SECRET, (err: any) => {
      if (err) throw new AppError(401, "Unauthorized");

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN } as jwt.SignOptions
      );

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: newAccessToken,
      };
    });
  }
}
