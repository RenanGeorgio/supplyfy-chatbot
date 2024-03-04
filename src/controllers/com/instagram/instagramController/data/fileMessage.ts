import { callSendAPI } from '../callSendAPI';

export default function sendFileMessage(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "file",
        payload: {
          url: process.env.SERVER_URL + "/assets/test.txt"
        }
      }
    }
  };

  return messageData;
}