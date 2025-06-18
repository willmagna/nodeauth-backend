import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { LoginUseCase } from "../useCases/LoginUseCase.js";
import { BaseController } from "../../../../core/BaseController.js";

@autoInjectable()
export class LoginController extends BaseController {
  constructor(
    @inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const result = await this.loginUseCase.execute({ email, password });

    this.ok(res, result);
  }
}
