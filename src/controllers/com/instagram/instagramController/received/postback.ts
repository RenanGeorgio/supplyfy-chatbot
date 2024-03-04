import { sendTextMessage } from '../sendMessageActions';
import { WebhookMsgPostbacks } from "../../../../../types";

export default function receivedPostback(event: WebhookMsgPostbacks) {
  const senderID = event.value.sender.user_ref;
  const recipientID = event.value.recipient.id;
  const timeOfPostback = event.value.timestamp;

  const payload = event.value.postback.payload;

  console.log(
    "Received postback for user %d and page %d with payload '%s' " + 'at %d',
    senderID,
    recipientID,
    payload,
    timeOfPostback
  );

  sendTextMessage(senderID, 'Postback called');
}