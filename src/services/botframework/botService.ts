import { sendFacebookTextMessage } from "../../controllers/com/facebook/facebookController";
import { INSTAGRAM_MSG_TYPE } from "../../controllers/com/instagram/consumer";
import { sendInstagramTextMessage } from "../../controllers/com/instagram/instagramController/data";
import { sendInstagramMessage } from "../../controllers/com/service";
import { sendWaTextMessage } from "../../controllers/com/whatsapp/whatsappController";
// import Queue from "../../libs/Queue";
import { WaMsgMetaData } from "../../types";
import { Platforms } from "../../types/enums";


export default async function botService(data: any) {
    try {
        const channel = data.value.channel;
        console.log("CHANNEL:  ", channel)
        
        switch (channel) {
            case Platforms.WHATSAPP:
                const whatsappData: WaMsgMetaData = {
                    senderPhoneNumberId: data.value.phoneNumberId,
                    senderPhoneNumber: data.value.phoneNumber,
                    recipientName: data.value.name,
                    recipientPhoneNumberId: data.value.to,
                    accessToken: data.value.token,
                }

                sendWaTextMessage(data.text, whatsappData);
                break;
            case Platforms.INSTAGRAM:
                if (data.value.type === INSTAGRAM_MSG_TYPE.PRIVATEREPLY) {
                    const type = data.value.key;

                    const requestBody = {
                        recipient: {
                            [type]: data.value.objectId,
                        },
                        message: data.text,
                        tag: "HUMAN_AGENT",
                    };

                    sendInstagramMessage(requestBody);
                } else {
                    const responses = sendInstagramTextMessage(data.value.senderID, data.text);

                    sendInstagramMessage(responses);
                }
                break;
            case Platforms.FACEBOOK:
                sendFacebookTextMessage(data.value.senderID, data.text)
                break;
            // case Platforms.TELEGRAM:
            //     const telegramData: any = {
            //         id: data.value.to,
            //         message: data.text,
            //     };

            //     // Queue.add("TelegramService", telegramData, "id mongo db");
            //     break;
            default:
                console.log('Tipo de atendimento desconhecido.');
                break;
        }

        return data
    } catch (error: any) {
        throw new Error("Error sending message");
    }
}