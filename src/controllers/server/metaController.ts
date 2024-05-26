import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";

export const save = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { accessToken, expiresIn, reauthorize_required_in, signedRequest, userID } = req.body;
    
    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?
        client_id=${appId}
        &redirect_uri={redirect-uri}
        &client_secret=${process.env.APP_SECRET}
        &code={code-parameter}`);
            
        return res.status(200).send({ message: "Server is OK!" });
    } catch (error) {
        next(error);
    }
};

export const chageCode = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { appId, redirectUri, code } = req.body;
    
    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?
        client_id=${appId}
        &redirect_uri=${redirectUri}
        &client_secret=${process.env.APP_SECRET}
        &code=${code}`);

        if (response) {
            const { access_token, token_type, expires_in } = response.body;

            return res.status(200).send({ access_token });
        }
            
        return res.status(400).send({ message: "Problem to obtain token" });
    } catch (error) {
        next(error);
    }
};