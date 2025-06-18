import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { BaseController } from "../../../../core/BaseController.js";
import { RegisterUseCase } from "../useCases/RegisterUseCase.js";

@autoInjectable()
export class RegisterController extends BaseController {
  constructor(
    @inject(RegisterUseCase)
    private readonly registerUseCase: RegisterUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { email, password, role, isVerified } = req.body;

    const result = await this.registerUseCase.execute({
      email,
      password,
      role,
      isVerified,
    });

    this.ok(res, result);
  }
}
