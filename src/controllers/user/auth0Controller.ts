import User from "../../models/user/User";
import { Response, NextFunction } from "express";
import { authApi } from "../../api";
import { generateAccessToken } from "../../helpers/accessToken";
import { CustomRequest } from "../../types";
import { Console } from "node:console";

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

        const response = await authApi("/ignai_clients", {
            method: "GET"
        });
        
        if (response.status === 200) {
            if (response.data && response.data.length > 0) {
                if (response.data.some(e => e.company_id === user.companyId)) {
                    const token = generateAccessToken(user._id);
                    return res
                        .status(200)
                        .send({ token, email: user.email, company: user.company, name: user.name });
                } else {
                    return res.status(401).send({ message: "Unauthorized" });
                }
            } else {
                return res.status(401).send({ message: "Unauthorized" });
            }
        } else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    } catch (error) {
        next(error);
    }
};

export const register = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const {user} = req.body;

        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        if (!user.email) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        if (!user.user_metadata.company) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        if (!user.user_metadata.full_name) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const response = await authApi("/ignai_clients", {
            method: "GET"
        });
        
        if (response.status === 200) {
            if (response.data && response.data.length > 0) {
                if (response.data.some((e) => e.company_key === user.user_metadata.company)) {
                    const company = response.data.find(e => e.company_key === user.user_metadata.company);
                    const newUser = await User.create({
                        email: user.email,
                        name: user.user_metadata.full_name,
                        cpf: company.cpf,
                        company: company.username,
                        company_id: company.company_id
                    });
                    return res.status(200).send({ email: newUser.email, company: newUser.company, name: newUser.name });
                } else {
                    return res.status(401).send({ message: "Unauthorized" });
                }
            } else {
                return res.status(401).send({ message: "Unauthorized" });
            }
        } else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
};

export const token = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, secret } = req.body;
        // const url = `${req.protocol}://${req.get('host')}`;
        // if (url !== process.env.AUTH0_ISSUER){
        //     return res.status(401).send({ message: "Unauthorized" });               
        // }
        const auth0_secret = process.env.AUTH0_CLIENT_SECRET ? process.env.AUTH0_CLIENT_SECRET.replace(/[\\"]/g, '') : ""
        if (secret !== auth0_secret) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        // if (id !== process.env.AUTH0_CLIENT_ID) {
        //     return res.status(401).send({ message: "Unauthorized" });
        // }
        const token = generateAccessToken(secret);
        return res.status(200).send({ token });               
    } catch (error) {
        next(error);
    }
};