import jwt from "jsonwebtoken";
import { appConfig } from "../config/config";
import { Response } from "express";
import bcrypt from "bcryptjs";
import { UserDoc } from "../models/user";
import { UserPayload } from "../types/user-payload";

export class AuthUtils {
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
  }

  static async comparePassword({
    password,
    candidatePassword,
  }: {
    password: string;
    candidatePassword: string;
  }) {
    return await bcrypt.compare(password, candidatePassword);
  }

  static createTokenPayload(user: UserDoc): UserPayload {
    return { id: user?._id as string };
  }

  static createAccessToken(user: UserPayload) {
    return jwt.sign(user, appConfig.jwtSecret!, {
      expiresIn: Number(appConfig.accessTokenExpiresIn),
    });
  }

  static validateAccessToken(token: string) {
    return jwt.verify(token, appConfig.jwtSecret!);
  }

  static attachCookies({ res, token }: { res: Response; token: string }) {
    res.cookie("__$token__", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 30 * 1000,
    });
  }

  static clearCookie(res: Response) {
    res.clearCookie("__$token__", {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
  }
}
