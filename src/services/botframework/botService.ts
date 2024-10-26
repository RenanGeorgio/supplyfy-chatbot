import { sendFacebookTextMessage } from "../../controllers/com/facebook/facebookController";
import { sendWaTextMessage } from "../../controllers/com/whatsapp/whatsappController";
import { WaMsgMetaData } from "../../types";
import { Platforms } from "../../types/enums";

export default async function botService(data: any) {
    try {
        const { result } = data;
        
        const channel = result.value.channel;

        switch (channel) {
            case Platforms.WHATSAPP:
                const whatsappData: WaMsgMetaData = {
                    senderPhoneNumberId: result.value.phoneNumberId,
                    senderPhoneNumber: result.value.phoneNumber,
                    recipientName: result.value.name,
                    recipientPhoneNumberId: result.value.to,
                    accessToken: result.value.token,
                }

                sendWaTextMessage(result.text, whatsappData);
                break;
            case Platforms.INSTAGRAM:
                // TO-DO: a resposta nao vai mais vir daqui 
                // const answer = await processQuestion(msgData);
                const response = { 
                    message: answer 
                };

                return response;
                console.log(`Cliente ${chatId} está sendo atendido por um humano.`);
                break;
            case Platforms.FACEBOOK:
                sendFacebookTextMessage(result.value.senderID, result.text)
                break;
            default:
                console.log('Tipo de atendimento desconhecido.');
                break;
        }

        return result
    } catch (error: any) {
        throw new Error("Error sending message");
    }
}