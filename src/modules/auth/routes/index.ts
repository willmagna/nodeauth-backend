import express from "express";
import { container } from "tsyringe";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { LoginController } from "../login/controllers/LoginController.js";
import { LogoutControler } from "../logout/controllers/LogoutController.js";
import { RefreshTokenController } from "../refreshToken/controllers/RefreshTokenController.js";
import { RegisterController } from "../register/controllers/RegisterController.js";
import { ForgotPasswordController } from "../forgotPassword/controllers/ForgotPasswordController.js";
import { ResetPasswordController } from "../resetPassword/controllers/ResetPasswordController.js";
import { RegisterInvitationController } from "../registerInvitation/controllers/RegisterInvitationController.js";

export const authRouter = express.Router();

const loginController = container.resolve(LoginController);
const logoutController = container.resolve(LogoutControler);
const refreshTokenController = container.resolve(RefreshTokenController);
const registerController = container.resolve(RegisterController);
const forgotPasswordController = container.resolve(ForgotPasswordController);
const resetPasswordController = container.resolve(ResetPasswordController);
const registerInvitationController = container.resolve(
  RegisterInvitationController
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
  "/register",
  asyncHandler((req, res) => registerController.execute(req, res))
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
  "/register-invitation",
  asyncHandler((req, res) => registerInvitationController.execute(req, res))
);
