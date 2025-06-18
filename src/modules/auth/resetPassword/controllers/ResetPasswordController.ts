import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";

import { BaseController } from "../../../../core/BaseController.js";
import { ResetPasswordUseCase } from "../useCases/ResetPasswordUseCase.js";

@autoInjectable()
export class ResetPasswordController extends BaseController {
  constructor(
    @inject(ResetPasswordUseCase)
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { email, code, newPassword } = req.body;

    const result = await this.resetPasswordUseCase.execute({
      email,
      code,
      newPassword,
    });

    this.ok(res, result);
  }
}
