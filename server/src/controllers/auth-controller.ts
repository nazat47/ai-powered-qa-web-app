import { Request, Response } from "express";
import { signInService, signUpService } from "../services/auth-service";
import { AuthUtils } from "../utils/auth-utils";

export const signUp = async (req: Request, res: Response) => {
  const data = req.body;

  const { user } = await signUpService(data);

  return res.status(201).json({ user });
};

export const signIn = async (req: Request, res: Response) => {
  const data = req.body;
  const { user, accessToken } = await signInService(data);

  AuthUtils.attachCookies({ res, token: accessToken });

  return res.status(201).json({ user, accessToken });
};

export const logout = async (req: Request, res: Response) => {
  AuthUtils.clearCookie(res);

  return res.status(204).json({});
};
