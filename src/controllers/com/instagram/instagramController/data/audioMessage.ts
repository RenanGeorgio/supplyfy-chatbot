export default function sendAudioMessage(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "audio",
        payload: {
          url: process.env.SERVER_URL + "/assets/sample.mp3"
        }
      }
    }
  };

  return messageData;
}