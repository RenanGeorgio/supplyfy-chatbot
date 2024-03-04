import { callSendAPI } from '../callSendAPI';
import { MessageData } from '../callSendAPI/callSendAPI';

export default function sendTextMessage(recipientId: string | number, messageText: string) {
  const messageData: MessageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  return messageData;
}