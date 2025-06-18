import { autoInjectable, inject } from "tsyringe";
import { LogoutUseCase } from "../useCases/LogoutUseCase.js";
import { Request, Response } from "express";
import { BaseController } from "../../../../core/BaseController.js";

@autoInjectable()
export class LogoutControler extends BaseController {
  constructor(
    @inject(LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    const result = await this.logoutUseCase.execute({ refreshToken });
    this.ok(res, result);
  }
}
