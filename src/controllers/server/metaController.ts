import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";

export const save = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { accessToken, expiresIn, reauthorize_required_in, signedRequest, userID } = req.body;
        // SALVAR
        return res.status(200).send({ message: "Server is OK!" });
    } catch (error) {
        next(error);
    }
};

export const chageCode = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { appId, redirectUri, code } = req.body;
    
    try {
        const changeResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?
            client_id=${appId}
            &redirect_uri=${redirectUri}
            &client_secret=${process.env.APP_SECRET}
            &code=${code}`
        );

        if (changeResponse) {
            const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?
                grant_type=fb_exchange_token
                &client_id=${appId}
                &client_secret=${process.env.APP_SECRET}
                &fb_exchange_token=${changeResponse.body.access_token}`
            );

            const { access_token, token_type, expires_in } = response.body; // SALVAR

            const pageResponse = await fetch(`https://graph.facebook.com/v19.0/${appId}/accounts?access_token=${access_token}`);

            const { data, paging } = pageResponse.body; // SALVAR

            return res.status(200).send({ changeResponse.body.access_token });
        }
            
        return res.status(400).send({ message: "Problem to obtain token" });
    } catch (error) {
        next(error);
    }
};