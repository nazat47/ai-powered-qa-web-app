import { Request } from "express";
import { Role } from "../models/user";
import { UserPayload } from "./user-payload";

export interface ExtendedRequest extends Request {
  user?: UserPayload;
}
