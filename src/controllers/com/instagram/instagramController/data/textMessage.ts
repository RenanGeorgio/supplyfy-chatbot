export default function sendTextMessage(recipientId: string | number, messageText: string) {
  const messageData = {
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