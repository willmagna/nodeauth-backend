import { singleton } from "tsyringe";
import User from "../../../../models/User.js";
import { AppError } from "../../../../utils/AppError.js";
import redisClient from "../../../../services/redisClient.js";
import { sendRecoveryEmail } from "../../../../services/mail.js";
import bcrypt from "bcryptjs";

interface ResetPasswordInput {
  email: string;
  code: string;
  newPassword: string;
}

@singleton()
export class ResetPasswordUseCase {
  public async execute({ email, code, newPassword }: ResetPasswordInput) {
    const key = `recover:${email}`;
    const storedCode = await redisClient.get(key);

    if (!storedCode) {
      throw new AppError(400, "No recovery code found or code expired");
    }

    if (storedCode !== code) {
      throw new AppError(400, "Invalid recovery code");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(400, "User not found");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();
    await redisClient.del(key);

    return "Password has been reset successfully";
  }
}
