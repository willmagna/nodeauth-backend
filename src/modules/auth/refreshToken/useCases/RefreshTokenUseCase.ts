import { singleton } from "tsyringe";
import User from "../../../../models/User.js";
import { AppError } from "../../../../utils/AppError.js";
import jwt from "jsonwebtoken";
import { RefreshTokenInput } from "../../shared/types.js";
import {
  ACCESS_EXPIRES_IN,
  ACCESS_SECRET,
  REFRESH_SECRET,
} from "../../shared/constants.js";

@singleton()
export class RefreshTokenUseCase {
  public async execute({ refreshToken }: RefreshTokenInput) {
    if (!refreshToken) {
      throw new AppError(401, "Unauthorize");
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
      throw new AppError(403, "Forbidden");
    }

    return jwt.verify(refreshToken, REFRESH_SECRET, (err: any) => {
      if (err) throw new AppError(403, "Forbidden");

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          isSuperAdmin: user.isSuperAdmin,
          role: user.role,
        },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
      );

      return { accessToken: newAccessToken };
    });
  }
}
