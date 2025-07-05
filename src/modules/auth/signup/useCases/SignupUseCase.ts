import { singleton } from "tsyringe";
import bcrypt from "bcryptjs";
import User from "../../../../models/User.js";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: string;
  isVerified?: boolean;
}

@singleton()
export class SignupUseCase {
  public async execute({
    name,
    email,
    password,
    role,
    isVerified,
  }: SignupInput) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified,
    });
    return await user.save();
  }
}
