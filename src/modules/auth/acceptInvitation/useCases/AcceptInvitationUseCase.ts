import { singleton } from "tsyringe";
import User from "../../../../models/User.js";
import { AppError } from "../../../../utils/AppError.js";
import { parseJWToken } from "../../../../utils/JWToken.js";
import bcrypt from "bcryptjs";

interface AcceptInvitationInput {
  verificationToken: string;
  password: string;
}

@singleton()
export class AcceptInvitationUseCase {
  public async execute({ verificationToken, password }: AcceptInvitationInput) {
    const user = await User.findOne({ verificationToken });

    if (!user) {
      throw new AppError(403, "Forbidden");
    }

    const { valid, expired } = parseJWToken(verificationToken);

    if (expired) {
      throw new AppError(403, "Token has expired");
    }
    if (!valid) {
      throw new AppError(401, "Unauthorized");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      throw new AppError(500, "Hashed Passowrd before save is null");
    }

    return await User.findOneAndUpdate(
      { verificationToken },
      {
        isVerified: true,
        password: hashedPassword,
        $unset: { verificationToken: "" },
      },
      { returnOriginal: false }
    );
  }
}
