import User from "../../models/user/User";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../../helpers/customRequest";
import authApi from "../../services/authApi";
import { generateAccessToken } from "../../helpers/accessToken";

export const login = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const response = await authApi("/login-chatbot", {
            method: "POST",
            data: {
                username: req.body.email,
                password: req.body.password,
            },
        });
        if (response.status === 200) {
            const token = generateAccessToken(user._id, user.email, user.company);

            req.session.user = { id: user._id, username: user.name, company: user.company };

            return res
                .status(200)
                .send({ token, email: user.email, company: user.company, name: user.name });
        } else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    } catch (error) {
        next(error);
    }
};