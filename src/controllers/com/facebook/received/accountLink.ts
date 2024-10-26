import { FaceMessagingEvent } from "../../../../types";


export default function receivedAccountLink(event: FaceMessagingEvent) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;

  const status = event.account_linking.status;
  const authCode = event.account_linking.authorization_code;

  console.log(
    'Received account link event with for user %d with status %s ' +
      'and auth code %s ',
    senderID,
    status,
    authCode
  );
}