import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";

import { BaseController } from "../../../../core/BaseController.js";
import { ForgotPasswordUseCase } from "../useCases/FortgotPasswordUseCase.js";

@autoInjectable()
export class ForgotPasswordController extends BaseController {
  constructor(
    @inject(ForgotPasswordUseCase)
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const result = await this.forgotPasswordUseCase.execute({ email });

    this.ok(res, result);
  }
}
