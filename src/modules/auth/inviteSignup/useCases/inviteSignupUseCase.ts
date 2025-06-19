import { singleton } from "tsyringe";
import User from "@/models/User.js";
import { createJWToken } from "@/utils/JWToken.js";
import { Role } from "../../shared/types.js";
import { sendInvitationEmail } from "@/providers/mail.js";
import logger from "@/lib/logger.js";

interface InviteSignupInput {
  email: string;
  authorizations: Role[];
}

@singleton()
export class InviteSignupUseCase {
  public async execute({ email, authorizations }: InviteSignupInput) {
    const verificationToken = createJWToken({
      data: { email, authorizations },
      options: { expiresIn: 2592000 }, //30 days in seconds
    });

    const invitationLink = `${process.env.FRONT_END_BASE_URL}/?token=${verificationToken}`;

    const user = new User({
      email,
      authorizations,
      verificationToken,
    });

    const userSaveResult = await user.save();

    await sendInvitationEmail(email, invitationLink).catch(async (err) => {
      await User.deleteOne({ email });
      logger.error(err, "Error on InviteSignupUseCase - sendInvitationEmail");
      throw err;
    });

    return userSaveResult;
  }
}
