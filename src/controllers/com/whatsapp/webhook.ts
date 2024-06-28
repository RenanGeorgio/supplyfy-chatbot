import { NextFunction, Response } from "express";
import XHubSignature from "x-hub-signature";
import { CustomRequest } from "../../../types";
import { messageStatuses } from "../../../helpers/messageStatuses";
import { processMessage } from "./processMessage";
import { msgStatusChange } from "../service";
import WhatsappService from "../../../services/whatsapp";
import { botExist } from "../../../repositories/bot";
import { error } from "node:console";

const appSecret = process.env.APP_SECRET ? process.env.APP_SECRET.replace(/[\\"]/g, '') : "secret";
const xhub = new XHubSignature("SHA256", appSecret);

export const messageHandler = async (
    req: CustomRequest,
) => {
    try {
        // Calcula o valor da assinatura x-hub para comparar com o valor no request header
        const calcXHubSignature = xhub.sign(req.rawBody).toLowerCase();

        // if (req.headers['x-hub-signature-256'] != calcXHubSignature) {
        //     console.log("Warning - request header X-Hub-Signature not present or invalid");
        //     return res.sendStatus(401);
        // }

        const body = req.body.entry?.[0]?.changes?.[0];

        if (!body) {
            throw new Error("Body indefinido")
        }

        if (body.field !== "messages") {
            throw new Error("Menssagens indefinidas")
        }

        const data = body.value;


        // TO-DO: Corrigir spam de eventos para responder apenas evento de mensagem recebida 
        if (data.messages?.[0]) {
            const bots = await botExist("services.whatsapp.numberId", data.metadata.phone_number_id)
            if (!bots) {
                throw new Error("Bot não encontrado")
            }

            const accessToken = bots.services?.whatsapp?.accessToken

            const whatsappInstance = new WhatsappService({
                senderPhoneNumberId: data.metadata.phone_number_id,
                recipientName: data.contacts[0].profile.name,
                recipientPhoneNumberId: data.messages[0].from,
                accessToken
            });

            try { // Marca msg como lida
                let sendReadStatus = messageStatuses?.read;
                sendReadStatus.message_id = data.messages[0].id;

                const response = await msgStatusChange(sendReadStatus?.message_id, whatsappInstance);

                console.log("Atualização de Status: " + response.status);
            } catch (error: any) {
                console.log(error?.message);
            }

            data.messages.map((message, index) => {
                console.log("mensagem: ", index)
                return processMessage(message, whatsappInstance)
            }).catch((error: any) => { throw new Error(error?.message) });
        }

        return null;
    } catch (error: any) {
        console.log(error?.message);
        throw new Error(error?.message)

    }
};