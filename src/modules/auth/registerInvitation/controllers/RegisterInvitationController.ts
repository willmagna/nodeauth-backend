import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { BaseController } from "../../../../core/BaseController.js";
import { RegisterInvitationUseCase } from "../useCases/RegisterInvitationUseCase.js";

@autoInjectable()
export class RegisterInvitationController extends BaseController {
  constructor(
    @inject(RegisterInvitationUseCase)
    private readonly registerInvitationUseCase: RegisterInvitationUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { email, role } = req.body;

    const result = await this.registerInvitationUseCase.execute({
      email,
      role,
    });

    this.ok(res, result);
  }
}
