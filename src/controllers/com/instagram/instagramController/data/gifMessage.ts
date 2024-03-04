import { callSendAPI } from '../callSendAPI';

export default function sendGifMessage(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: process.env.SERVER_URL + "/assets/instagram_logo.gif"
        }
      }
    }
  };

  return messageData;
}