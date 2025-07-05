import { singleton } from "tsyringe";
import User from "@/models/User.js";
import { createJWToken } from "@/utils/JWToken.js";
import { sendInvitationEmail } from "@/providers/mail.js";
import logger from "@/lib/logger.js";

interface InviteSignupInput {
  name: string;
  email: string;
  role: string;
}

@singleton()
export class InviteSignupUseCase {
  public async execute({ name, email, role }: InviteSignupInput) {
    const verificationToken = createJWToken({
      data: { name, email, role },
      options: { expiresIn: 2592000 }, //30 days in seconds
    });

    const invitationLink = `${process.env.FRONT_END_BASE_URL}/?token=${verificationToken}`;

    const user = new User({
      name,
      email,
      role,
      verificationToken,
    });

    const userSaveResult = await user.save();

    try {
      await sendInvitationEmail(email, invitationLink);
    } catch (error) {
      await User.deleteOne({ email });
      logger.error(error, "Error on InviteSignupUseCase - sendInvitationEmail");
      throw error;
    }

    return userSaveResult;
  }
}
