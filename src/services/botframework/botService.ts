import { sendFacebookTextMessage } from "../../controllers/com/facebook/facebookController";
import { INSTAGRAM_MSG_TYPE } from "../../controllers/com/instagram/consumer";
import { sendInstagramTextMessage } from "../../controllers/com/instagram/instagramController/data";
import { sendInstagramMessage } from "../../controllers/com/service";
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
                if (result.value.type === INSTAGRAM_MSG_TYPE.PRIVATEREPLY) {
                    const type = result.value.key;

                    const requestBody = {
                        recipient: {
                          [type]: result.value.objectId,
                        },
                        message: result.text,
                        tag: "HUMAN_AGENT",
                    };

                    sendInstagramMessage(requestBody);
                } else {
                    const responses = sendInstagramTextMessage(result.value.senderID, result.text);

                    sendInstagramMessage(responses);
                }
                break;
            case Platforms.FACEBOOK:
                sendFacebookTextMessage(result.value.senderID, result.text);
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