import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { LoginUseCase } from "../useCases/LoginUseCase.js";
import { BaseController } from "@/core/BaseController.js";
import { REFRESH_TOKEN_COOKIE_MAX_AGE } from "@/config/env.js";

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

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE * 24 * 60 * 60 * 1000,
    });

    this.ok(res, {
      id: result.id,
      name: result.name,
      email: result.email,
      role: result.role,
      accessToken: result.accessToken,
    });
  }
}
