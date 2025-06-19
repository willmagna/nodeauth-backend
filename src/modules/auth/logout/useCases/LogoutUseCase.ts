import { singleton } from "tsyringe";
import User from "../../../../models/User.js";
import { AppError } from "../../../../utils/AppError.js";
import { RefreshTokenInput } from "../../shared/types.js";

@singleton()
export class LogoutUseCase {
  public async execute({ refreshToken }: RefreshTokenInput) {
    if (!refreshToken) {
      throw new AppError(401, "Unauthorize");
    }

    return await User.updateOne(
      { refreshToken },
      { $unset: { refreshToken: "" } }
    );
  }
}
