import { Response, NextFunction } from "express";
import XHubSignature from "x-hub-signature";
import { CustomRequest } from "../../helpers/customRequest";
import { messageStatuses, statUses } from "../../helpers/messageStatuses";
import { processMessage } from "../processMessage";

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
        // Calcula o valor da assinatura x-hub para comparar com o valor no request header
        const calcXHubSignature = xhub.sign(req.rawBody).toLowerCase();

        if (req.headers['x-hub-signature-256'] != calcXHubSignature) {
            console.log("Warning - request header X-Hub-Signature not present or invalid");
            res.sendStatus(401);
            return;
        }

        console.log("request header X-Hub-Signature validated");

        const body = req.body.entry[0].changes[0];
        
        if (body.field !== "messages") {
            return res.sendStatus(400);
        }

        if (body.changes[0].value.hasOwnProperty("messages")) {
            try { // Marca msg como lida
                let sendReadStatus: statUses = messageStatuses?.read;
                sendReadStatus.message_id = body.value.messages[0].id;

                const response = await whatsappCloudAp("/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${this.bearerToken}`
                    },
                    data: sendReadStatus
                });

                console.log(response);
            } catch (error) {
                console.log(error);
            }
        
            body.value.messages.forEach(processMessage);
        }

        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};