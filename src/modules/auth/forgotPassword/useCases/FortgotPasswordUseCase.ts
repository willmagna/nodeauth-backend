import { singleton } from "tsyringe";
import User from "../../../../models/User.js";
import { AppError } from "../../../../utils/AppError.js";
import redisClient from "../../../../services/redisClient.js";
import { sendRecoveryEmail } from "../../../../services/mail.js";

interface ForgotPasswordInput {
  email: string;
}

@singleton()
export class ForgotPasswordUseCase {
  public async execute({ email }: ForgotPasswordInput) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const key = `recover:${email}`;

    await redisClient.set(key, code, { EX: 900 }); // 15 minutes expiration

    sendRecoveryEmail(email, code);

    return "Recovery code sent to your email";
  }
}
