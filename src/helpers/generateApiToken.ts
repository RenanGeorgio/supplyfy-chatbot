import jsonwebtoken from "jsonwebtoken";
import { Types } from "mongoose";

export default function generateApiToken(sub: Types.ObjectId) {
  const secret = process.env.API_TOKEN_SECRET;

  if (!secret) {
    throw new Error("API_TOKEN_SECRET is not defined");
  }

  return jsonwebtoken.sign({ sub }, secret);
}