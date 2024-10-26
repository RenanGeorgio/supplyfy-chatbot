import { sendFacebookMessage } from "../service";
import { FaceMsgData } from "../../../types";


export function sendFacebookTextMessage(recipientID: string, messageText: string) {
  const messageData: FaceMsgData = {
    recipient: {
      id: recipientID // vem pra mim como senderId (eles trocam de responsabilidade quando passa pelo webhook)
    },
    messaging_type: 'RESPONSE',
    message: {
      text: messageText,
      metadata: process.env.FACEBOOK_METADATA
    }
  };

  sendFacebookMessage(messageData);
}