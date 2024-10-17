import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { createOrUpdateAuthData } from "../../repositories/meta";
import mongoose from "mongoose";

export const save = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.query as { companyId: string };
    const { accessToken, expiresIn, reauthorize_required_in, signedRequest, userID } = req.body;
    
    if(!companyId){
      return res.status(400).send({ message: "companyId is required" });
    }

    if(mongoose.Types.ObjectId.isValid(companyId)){
      return res.status(400).send({ message: "companyId is invalid" });
    }

    const create = await createOrUpdateAuthData({
      companyId,
      accessToken,
      expiresIn,
      reauthorizeRequiredIn: reauthorize_required_in,
      signedRequest,
      userId: userID
    });

    if (!create) {
      return res.status(400).send({ message: "Error" });
    }

    return res.status(200).send({ message: "Server is OK!" });
  } catch (error) {
    next(error);
  }
};

export const chageCode = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { appId, redirectUri, code } = req.body;

  try {
    const changeResponse =
      await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?
            client_id=${appId}
            &redirect_uri=${redirectUri}
            &client_secret=${process.env.APP_SECRET}
            &code=${code}`);

    if (changeResponse) {
      const changResData = await changeResponse.json(); // SALVAR
      const response =
        await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?
                grant_type=fb_exchange_token
                &client_id=${appId}
                &client_secret=${process.env.APP_SECRET}
                &fb_exchange_token=${changResData.access_token}`);

      const { access_token, token_type, expires_in } = await response.json(); // SALVAR

      if(access_token){
        await createOrUpdateAuthData({ 
          companyId, 
          accessToken: access_token, 
          expiresIn: expires_in, 
          tokenType: token_type 
        })
      }

      const pageResponse = await fetch(
        `https://graph.facebook.com/v20.0/${appId}/accounts?access_token=${access_token}`
      );

      const { data, paging } = await pageResponse.json(); // SALVAR

      return res.status(200).send({ access_token: changResData.access_token });
    }

    return res.status(400).send({ message: "Problem to obtain token" });
  } catch (error) {
    next(error);
  }
};

export const chageWhatsappCode = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { appId, userID, expiresIn, code } = req.body;

  try {
    const response = await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?
      client_id=${appId}
      &client_secret=${process.env.APP_SECRET}
      &code=${code}`);

    // TO-DO: salvar valores
    if (response) {
      return res.status(200);
    }

    return res.status(400).send({ message: "Problem to obtain token" });
  } catch (error) {
    next(error);
  }
};