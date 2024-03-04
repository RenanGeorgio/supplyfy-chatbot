import { callSendAPI } from '../callSendAPI';

export default function sendVideoMessage(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "video",
        payload: {
          url: process.env.SERVER_URL + "/assets/allofus480.mov"
        }
      }
    }
  };

  return messageData;
}