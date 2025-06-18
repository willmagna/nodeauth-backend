import { injectable, singleton } from "tsyringe";
import { AppError } from "../../../../utils/AppError.js";
import bcrypt from "bcryptjs";
import User from "../../../../models/User.js";

interface RegisterInput {
  email: string;
  password: string;
  role?: object;
  isVerified?: boolean;
}

@singleton()
export class RegisterUseCase {
  public async execute({ email, password, role, isVerified }: RegisterInput) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      role,
      isVerified,
    });
    return await user.save();
  }
}
