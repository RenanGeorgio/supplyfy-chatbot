import { callSendAPI } from '../callSendAPI';

export default function sendImageMessage(recipientId: string | number, imagePath: string) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imagePath
        }
      }
    }
  };

  return messageData;
}