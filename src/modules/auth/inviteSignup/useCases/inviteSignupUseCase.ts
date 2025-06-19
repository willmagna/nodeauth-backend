import { singleton } from "tsyringe";
import User from "../../../../models/User.js";
import { createJWToken } from "../../../../utils/tokenValidation.js";
import { Role } from "../../shared/types.js";
import { sendInvitationEmail } from "../../../../providers/mail.js";

interface InviteSignupInput {
  email: string;
  authorizations: Role[];
}

@singleton()
export class InviteSignupUseCase {
  public async execute({ email, authorizations }: InviteSignupInput) {
    const verificationToken = createJWToken({
      obj: { email, authorizations },
      expiresIn: "24h",
    });

    const invitationLink = `${process.env.FRONT_END_BASE_URL}/?token=${verificationToken}`;

    await sendInvitationEmail(email, invitationLink);

    const user = new User({
      email,
      authorizations,
      verificationToken,
    });

    return await user.save();
  }
}
