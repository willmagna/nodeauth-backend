import { injectable, inject } from "tsyringe";
import { BaseController } from "../../../../core/BaseController.js";
import { RefreshTokenUseCase } from "../useCases/RefreshTokenUseCase.js";
import { Request, Response } from "express";

@injectable()
export class RefreshTokenController extends BaseController {
  constructor(
    @inject(RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    const result = await this.refreshTokenUseCase.execute({ refreshToken });
    this.ok(res, result);
  }
}
