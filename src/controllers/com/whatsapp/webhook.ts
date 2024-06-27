import { NextFunction, Response } from "express";
import XHubSignature from "x-hub-signature";
import { CustomRequest } from "../../../types";
import { messageStatuses } from "../../../helpers/messageStatuses";
import { processMessage } from "./processMessage";
import { msgStatusChange } from "../service";
import WhatsappService from "../../../services/whatsapp";

const appSecret = process.env.APP_SECRET ? process.env.APP_SECRET.replace(/[\\"]/g, '') : "secret";
const xhub = new XHubSignature("SHA256", appSecret);

export const messageHandler = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // Calcula o valor da assinatura x-hub para comparar com o valor no request header
        const calcXHubSignature = xhub.sign(req.rawBody).toLowerCase();

        console.log(calcXHubSignature)
        console.log(req.headers['x-hub-signature-256'])

        if (req.headers['x-hub-signature-256'] != calcXHubSignature) {
            console.log("Warning - request header X-Hub-Signature not present or invalid");
            return res.sendStatus(401);
        }

        console.log("request header X-Hub-Signature validated");

        const body = req.body.entry[0].changes[0];
        
        if (body.field !== "messages") {
            return res.sendStatus(400);
        }

        const data = body.value;

        if (data.hasOwnProperty("messages")) {
            const whatsappInstance = new WhatsappService(
                data.metadata.phone_number_id,
                data.contacts[0].profile.name,
                data.messages[0].from
            );

            try { // Marca msg como lida
                let sendReadStatus = messageStatuses?.read;
                sendReadStatus.message_id = data.messages[0].id;

                const response = await msgStatusChange(sendReadStatus?.message_id, whatsappInstance.getApi());

                console.log(response);
            } catch (error) {
                console.log(error);
            }
        
            data.messages.forEach(message => processMessage(message, whatsappInstance));
        }

        return res.sendStatus(200);
    } catch (error: any) {
        next(error);
    }           
};