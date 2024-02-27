import { Types } from "mongoose";
import jsonwebtoken from "jsonwebtoken";

export const generateAccessToken = (
    sub: Types.ObjectId
) => {
    return jsonwebtoken.sign(
        { sub },
        process.env.TOKEN_SECRET || "secret",
        {
            expiresIn: "24h",
        }
    );
};