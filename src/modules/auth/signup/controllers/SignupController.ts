import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { BaseController } from "../../../../core/BaseController.js";
import { SignupUseCase } from "../useCases/SignupUseCase.js";

@autoInjectable()
export class SignupController extends BaseController {
  constructor(
    @inject(SignupUseCase)
    private readonly signupUseCase: SignupUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { name, email, password, role, isVerified } = req.body;

    const result = await this.signupUseCase.execute({
      name,
      email,
      password,
      role,
      isVerified,
    });

    this.ok(res, result);
  }
}
