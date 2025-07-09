import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { BaseController } from "../../../../core/BaseController.js";
import { AcceptInvitationUseCase } from "../useCases/AcceptInvitationUseCase.js";
import logger from "@/lib/logger.js";

@autoInjectable()
export class AcceptInvitationController extends BaseController {
  constructor(
    @inject(AcceptInvitationUseCase)
    private readonly acceptInvitationUseCase: AcceptInvitationUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { verificationToken, password } = req.body;

    logger.info("/auth/accept-invitation");

    const result = await this.acceptInvitationUseCase.execute({
      verificationToken,
      password,
    });

    this.ok(res, result);
  }
}
