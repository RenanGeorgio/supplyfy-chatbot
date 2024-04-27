import { sendFacebookText } from "../processMessage";
import { FaceMessagingEvent } from "../../../../types";

export default function receivedAuthentication(event: FaceMessagingEvent) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfAuth = event.timestamp;

  if (event?.optin?.ref) {
    const passThroughParam = event.optin.ref;

    console.log("Received authentication for user %d and page %d with pass " +
      "through param '%s' at %d", senderID, recipientID, passThroughParam,
      timeOfAuth
    );

    sendFacebookText(senderID, "Authentication successful");
  }
}