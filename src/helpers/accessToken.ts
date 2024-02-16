import { Types } from "mongoose";
import jsonwebtoken from "jsonwebtoken";

export const generateAccessToken = (
    _id: Types.ObjectId,
    email: string,
    company: string,
) => {
    return jsonwebtoken.sign(
        { _id, email, company },
        process.env.TOKEN_SECRET || "secret",
        {
            expiresIn: "24h",
        }
    );
};