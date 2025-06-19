import { singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import User from "../../../../models/User.js";
import { Role } from "../../shared/types.js";

interface SignupInput {
  email: string;
  password: string;
  authorizations?: Role[];
  isVerified?: boolean;
}

@singleton()
export class SignupUseCase {
  public async execute({
    email,
    password,
    authorizations,
    isVerified,
  }: SignupInput) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      authorizations,
      isVerified,
    });
    return await user.save();
  }
}
