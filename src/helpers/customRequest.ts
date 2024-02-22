import { Request } from "express";
import { Types } from "mongoose";

export interface User {
    sub: Types.ObjectId | string;
}

export interface CustomRequest extends Request {
    user?: User;
}