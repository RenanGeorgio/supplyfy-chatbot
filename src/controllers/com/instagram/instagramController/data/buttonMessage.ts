import { callSendAPI } from '../callSendAPI';

export default function sendButtonMessage(recipientId: string | number, label: string = "test") {
  const messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: label,
          buttons: [
            {
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            },
            {
              type: "postback",
              title: "Trigger Postback",
              payload: "DEVELOPER_DEFINED_PAYLOAD"
            },
            {
              type: "phone_number",
              title: "Call Phone Number",
              payload: "+16505551234"
            }
          ]
        }
      }
    }
  };

  return messageData;
}