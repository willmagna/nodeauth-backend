import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { BaseController } from "../../../../core/BaseController.js";
import { InviteSignupUseCase } from "../useCases/inviteSignupUseCase.js";

@autoInjectable()
export class InviteSignupController extends BaseController {
  constructor(
    @inject(InviteSignupUseCase)
    private readonly inviteSignupUseCase: InviteSignupUseCase
  ) {
    super();
  }

  public async execute(req: Request, res: Response): Promise<void> {
    const { email, authorizations } = req.body;

    const result = await this.inviteSignupUseCase.execute({
      email,
      authorizations,
    });

    this.ok(res, result);
  }
}
