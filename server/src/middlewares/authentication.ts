import { NextFunction, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors";
import { AuthUtils } from "../utils/auth-utils";
import { ExtendedRequest } from "../types/extended-request";

export const authenticate = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["__$token__"];
    if (!token) {
      throw new ForbiddenError("You are not authorized to access the route.");
    }

    const decodedData = AuthUtils.validateAccessToken(token);
    req.user = decodedData as { id: string };
    next();
  } catch (error: any) {
    if (error?.name === "TokenExpiredError") {
      throw new UnauthorizedError("Access token expired. Please login again.");
    }
    if (error?.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Access denied. Invalid token");
    }
    throw error;
  }
};
