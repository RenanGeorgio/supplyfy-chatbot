import "express";
import XHubSignature from "x-hub-signature";
import { messageStatuses } from "../../../helpers/messageStatuses";
import { processWaMessage } from "./processMessage";
import { msgStatusChange } from "../service";
//import WhatsappService from "../../../services/whatsapp";
import { botExist } from "../../../repositories/bot";
import { CustomRequest, WaMsgMetaData } from "../../../types";

const appSecret = process.env.APP_SECRET ? process.env.APP_SECRET.replace(/[\\"]/g, '') : "secret";
const xhub = new XHubSignature("SHA256", appSecret);

export const messageHandler = async (
    req: CustomRequest,
) => {
    try {
        // Calcula o valor da assinatura x-hub para comparar com o valor no request header
        // const calcXHubSignature = xhub.sign(req.rawBody).toLowerCase();

        // if (req.headers['x-hub-signature-256'] != calcXHubSignature) {
        //     console.log("Warning - request header X-Hub-Signature not present or invalid");
        //     return res.sendStatus(401);
        // }

        const body = req.body.entry?.[0]?.changes?.[0];

        if (!body) {
            throw new Error("Body indefinido");
        }

        if (body.field !== "messages") {
            throw new Error("Menssagens indefinidas");
        }

        const data = body.value;

        // TO-DO: Corrigir spam de eventos para responder apenas evento de mensagem recebida 
        if (data.messages?.[0]) {
            const bots = await botExist("services.whatsapp.numberId", data.metadata.phone_number_id);

            if (!bots) {
                throw new Error("Bot não encontrado");
            }

            const whatsappData: WaMsgMetaData = {
                senderPhoneNumberId: data.metadata.phone_number_id,
                senderPhoneNumber: data.metadata.display_phone_number,
                recipientName: data.contacts[0].profile.name,
                recipientPhoneNumberId: data.messages[0].from,
                accessToken: bots.services?.whatsapp?.accessToken || ""
            }

            try { // Marca msg como lida
                let sendReadStatus = messageStatuses?.read;
                sendReadStatus.message_id = data.messages[0].id;

                const response = await msgStatusChange(sendReadStatus?.message_id, whatsappData);

                console.log("Atualização de Status: " + response?.status);
            } catch (error: any) {
                console.log(error?.message);
            }

            data.messages.map((message, index) => {
                console.log("mensagem: ", index);
                return processWaMessage(message, whatsappData, bots.companyId);
            });
        }

        return null
    } catch (error: any) {
        console.log(error?.message);
        throw new Error(error?.message);
    }
};