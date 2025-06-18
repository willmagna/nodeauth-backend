import { injectable, singleton } from "tsyringe";
import { AppError } from "../../../../utils/AppError.js";
import bcrypt from "bcryptjs";
import User from "../../../../models/User.js";
import { createJWToken } from "../../../../utils/tokenValidation.js";
import { parseJWToken } from "../../../../utils/tokenValidation.js";

interface RegisterInvitationInput {
  email: string;
  role: object;
}

@singleton()
export class RegisterInvitationUseCase {
  public async execute({ email, role }: RegisterInvitationInput) {
    const verificationToken = createJWToken({
      obj: { email, role },
      expiresIn: "24h",
    });

    console.log(verificationToken);

    const result = parseJWToken(verificationToken);

    console.log(JSON.stringify(result, null, 2));

    // Send email

    const user = new User({
      email,
      role,
      verificationToken,
    });

    return user.save();
  }
}
