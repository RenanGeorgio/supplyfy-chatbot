import { FaceMessagingEvent } from "../../../../types";
import { sendFacebookText } from "../processMessage";

export default function receivedPostback(event: FaceMessagingEvent) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfPostback = event.timestamp;

  const payload = event.postback.payload;

  console.log(
    "Received postback for user %d and page %d with payload '%s' " + 'at %d',
    senderID,
    recipientID,
    payload,
    timeOfPostback
  );

  sendFacebookText(senderID, 'Postback called');
}