import { Response, NextFunction } from "express";
import { CustomRequest } from "../../helpers/customRequest";
import XHubSignature from "x-hub-signature";

const verificationToken = process.env.WEBHOOK_VERIFICATION_TOKEN;
const appSecret = process.env.APP_SECRET;
const xhub = new XHubSignature("SHA256", appSecret);

export const subscribeToWb = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == verificationToken) {
            return res.status(200).send(req.query['hub.challenge']);
        } else {
            return res.sendStatus(400);
        }
    } catch (error) {
        next(error);
    }
};

export const incomingWb = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == verificationToken) {
            return res.status(200).send(req.query['hub.challenge']);
        } else {
            return res.sendStatus(400);
        }
    } catch (error) {
        next(error);
    }
};