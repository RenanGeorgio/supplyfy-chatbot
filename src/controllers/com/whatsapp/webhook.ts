import { Response } from "express";
import XHubSignature from "x-hub-signature";
import { CustomRequest, statUses } from "../../../types";
import { messageStatuses } from "../../../helpers/messageStatuses";
import { processMessage } from "./processMessage";
import { msgStatusChange } from "../service";

const appSecret = process.env.APP_SECRET;
const xhub = new XHubSignature("SHA256", appSecret);

export const messageHandler = async (
    req: CustomRequest,
    res: Response
) => {
    try {
        // Calcula o valor da assinatura x-hub para comparar com o valor no request header
        const calcXHubSignature = xhub.sign(req.rawBody).toLowerCase();

        if (req.headers['x-hub-signature-256'] != calcXHubSignature) {
            console.log("Warning - request header X-Hub-Signature not present or invalid");

            res.sendStatus(401);
        }

        console.log("request header X-Hub-Signature validated");

        const body = req.body.entry[0].changes[0];
        
        if (body.field !== "messages") {
            res.sendStatus(400);
        }

        if (body.changes[0].value.hasOwnProperty("messages")) {
            try { // Marca msg como lida
                let sendReadStatus = messageStatuses?.read;
                sendReadStatus.message_id = body.value.messages[0].id;

                const response = await msgStatusChange(sendReadStatus?.message_id);

                console.log(response);
            } catch (error) {
                console.log(error);
            }
        
            body.value.messages.forEach(processMessage);
        }

        res.sendStatus(200);
    } catch (error: any) {
        return res.status(500).send({ message: error.message });
    }           
};