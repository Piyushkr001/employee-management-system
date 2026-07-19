import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/response";
import { getAuthCookieOptions, getClearAuthCookieOptions } from "../../config/cookies";
import { env } from "../../config/env";

export class AuthController {
  private service = new AuthService();

  login = async (req: Request, res: Response) => {
    const { token, user } = await this.service.login(req.body);

    res.cookie(env.COOKIE_NAME, token, getAuthCookieOptions());

    sendResponse(res, 200, "Login successful", { user });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie(env.COOKIE_NAME, getClearAuthCookieOptions());
    sendResponse(res, 200, "Logout successful");
  };

  getCurrentUser = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, 401, "Not authenticated", undefined, { code: "UNAUTHENTICATED" });
    }

    const user = await this.service.getCurrentUser(userId);
    sendResponse(res, 200, "Current user retrieved", { user });
  };
}
