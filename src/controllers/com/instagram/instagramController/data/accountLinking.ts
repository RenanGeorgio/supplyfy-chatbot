export default function sendAccountLinking(recipientId: string | number) {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "Welcome. Link your account.",
          buttons: [
            {
              type: "account_link",
              url: process.env.SERVER_URL + "/authorize"
            }
          ]
        }
      }
    }
  };

  return messageData;
}