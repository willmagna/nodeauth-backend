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
    const { email, password, authorizations, isVerified } = req.body;

    const result = await this.signupUseCase.execute({
      email,
      password,
      authorizations,
      isVerified,
    });

    this.ok(res, result);
  }
}
