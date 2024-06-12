import User from "../../models/user/User";
import { Response, NextFunction } from "express";
import { authApi } from "../../api";
import { generateAccessToken } from "../../helpers/accessToken";
import { CustomRequest } from "../../types";

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
                if (response.data.some(e => e.company_id === user.companyId )) {
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
        console.log('User Auth0:')
        console.log(user)

        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const response = await authApi("/ignai_clients", {
            method: "GET"
        });

        // if (response.status === 200) {
        //     if (response.data && response.data.length > 0) {
        //         if (response.data.some(e => e.company === company)) {
        //             const user = await User.create({
        //                 email,
        //                 name,
        //                 cpf: response.data.cpf,
        //                 company: response.data.company,
        //                 company_id: response.data.company_id,
        //             });
        //             const token = generateAccessToken(user._id);
        //             return res.status(200).send({ token, email: user.email, company: user.company, name: user.name });
        //         } else {
        //             return res.status(401).send({ message: "Unauthorized" });
        //         }
        //     } else {
        //         return res.status(401).send({ message: "Unauthorized" });
        //     }
        // } else {
            return res.status(401).send({ message: "Unauthorized" });
        // }
    } catch (error) {
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