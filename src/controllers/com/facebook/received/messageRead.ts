import { FaceMessagingEvent } from "../../../../types";

export default function receivedMessageRead(event: FaceMessagingEvent) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;

  const watermark = event.read.watermark;
  const sequenceNumber = event.read.seq;

  console.log("Received message read event for watermark %d and sequence " + "number %d", watermark, sequenceNumber);
}