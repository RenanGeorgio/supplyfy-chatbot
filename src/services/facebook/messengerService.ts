import { processQuestion } from "../../libs/bot/nlp/manager";
import callSendApi from "./api/callSendApi";

export default async function messengerService(data) {
  const { credentials, messages } = data;
  for (const entry of messages) {
    const webhookEvent = entry.messaging[0];
    const senderPsid = webhookEvent.sender.id;

    if (webhookEvent.message) {
      const responseMessage = await processQuestion(webhookEvent.message.text);
      try {
        const send = await callSendApi({
          message: { senderId: senderPsid, text: responseMessage },
          credentials: credentials,
        });
        return send.data;
      } catch (error: any) {
        console.log(error);
        throw new Error("Error sending message");
      }
    } else if (webhookEvent.postback) {
      // handlePostback(senderPsid, webhookEvent.postback);
    }
  }
}
