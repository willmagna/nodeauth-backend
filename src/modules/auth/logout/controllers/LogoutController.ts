import { autoInjectable, inject } from "tsyringe";
import { LogoutUseCase } from "../useCases/LogoutUseCase.js";
import { Request, Response } from "express";
import { BaseController } from "../../../../core/BaseController.js";
import logger from "@/lib/logger.js";

@autoInjectable()
export class LogoutControler extends BaseController {
  constructor(
    @inject(LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;

    logger.info("/auth/logout");

    const result = await this.logoutUseCase.execute({ refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    logger.info(`User Logged Out`);

    this.ok(res, { message: "Logged Out" });
  }
}
