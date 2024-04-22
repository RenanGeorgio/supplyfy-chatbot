import { processQuestion } from "../../libs/trainModel";
import callSendApi from "./api/callSendApi";

export default {
  key: "MessengerService",
  async handle({ data }) {
    const { credentials, messages } = data;
    for (const entry of messages) {
      const webhookEvent = entry.messaging[0];
      const senderPsid = webhookEvent.sender.id;
      console.log("Sender PSID: " + senderPsid);
      
      if (webhookEvent.message) {
        const responseMessage = await processQuestion(
          webhookEvent.message.text
        );
        try {
          const send = await callSendApi({
            message: { senderId: senderPsid, text: responseMessage },
            credentials: credentials,
          });
          return send.data;
        } catch (error: any) {
          console.log(error)
          throw new Error("Error sending message");
        }
      } else if (webhookEvent.postback) {
        // handlePostback(senderPsid, webhookEvent.postback);
      }
    };
  },
  options: {
    attempts: 3,
    backoff: 1000,
    // testar
    removeOnComplete: true,
  }
};
