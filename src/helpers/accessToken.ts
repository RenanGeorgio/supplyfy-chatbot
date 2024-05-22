import { Types } from "mongoose";
import jsonwebtoken from "jsonwebtoken";

export const generateAccessToken = (
    sub: Types.ObjectId
) => {
    return jsonwebtoken.sign(
        { sub },
        process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET.replace(/[\\"]/g, '') : "secret",
        {
            expiresIn: "24h",
        }
    );
};