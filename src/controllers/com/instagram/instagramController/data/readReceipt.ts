export default function sendReadReceipt(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  return messageData;
}