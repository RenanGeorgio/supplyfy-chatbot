import { Request } from "express";
import { Session } from "express-session";
import { Types } from "mongoose";

export interface User {
  sub: Types.ObjectId | string;
}

export interface CustomRequest extends Request {
  user?: User;
  rawBody?: Buffer;
  session: Session;
}