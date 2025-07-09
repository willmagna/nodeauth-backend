import express from "express";
import { container } from "tsyringe";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { LoginController } from "../login/controllers/LoginController.js";
import { LogoutControler } from "../logout/controllers/LogoutController.js";
import { RefreshTokenController } from "../refreshToken/controllers/RefreshTokenController.js";
import { SignupController } from "../signup/controllers/SignupController.js";
import { ForgotPasswordController } from "../forgotPassword/controllers/ForgotPasswordController.js";
import { ResetPasswordController } from "../resetPassword/controllers/ResetPasswordController.js";
import { InviteSignupController } from "../inviteSignup/controllers/inviteSignupController.js";
import { AcceptInvitationController } from "../acceptInvitation/controllers/AcceptInvitationController.js";

export const authRouter = express.Router();

const loginController = container.resolve(LoginController);
const logoutController = container.resolve(LogoutControler);
const refreshTokenController = container.resolve(RefreshTokenController);
const signUpController = container.resolve(SignupController);
const forgotPasswordController = container.resolve(ForgotPasswordController);
const resetPasswordController = container.resolve(ResetPasswordController);
const inviteSignupController = container.resolve(InviteSignupController);
const acceptInvitationController = container.resolve(
  AcceptInvitationController
);

authRouter.post(
  "/login",
  asyncHandler((req, res) => loginController.execute(req, res))
);

authRouter.post(
  "/logout",
  asyncHandler((req, res) => logoutController.execute(req, res))
);

authRouter.post(
  "/refresh-token",
  asyncHandler((req, res) => refreshTokenController.execute(req, res))
);

authRouter.post(
  "/signup",
  asyncHandler((req, res) => signUpController.execute(req, res))
);

authRouter.post(
  "/forgot-password",
  asyncHandler((req, res) => forgotPasswordController.execute(req, res))
);

authRouter.post(
  "/reset-password",
  asyncHandler((req, res) => resetPasswordController.execute(req, res))
);

authRouter.post(
  "/invite-signup",
  asyncHandler((req, res) => inviteSignupController.execute(req, res))
);

authRouter.post(
  "/accept-invitation",
  asyncHandler((req, res) => acceptInvitationController.execute(req, res))
);
