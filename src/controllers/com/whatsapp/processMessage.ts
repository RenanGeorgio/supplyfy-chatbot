import { sendTextMessage } from "./whatsappController";
import { webhookTrigger } from "../../../webhooks/custom/webhookTrigger";
import { findWebhook } from "../../../repositories/webhook";
import { msgQueue } from "../../../libs/bot/queue";
import { directLineService } from "../../../core/http";
import { SendContacts, SendDoc, SendImg, SendInterativeButton, SendInterativeList, SendText } from "../../../types";
import { Events } from "../../../types/enums";

type MsgTypes = SendDoc | SendImg | SendContacts | SendInterativeList | SendInterativeButton | SendText;

function interactiveMessage(message: SendInterativeList | SendInterativeButton) {
  const interactiveType = message.interactive.type;

  /*
  if (interactiveType === "button_reply") {
    const buttonId = message.interactive.button_reply.id;
    const buttonTitle = message.interactive.button_reply.title;

    if (buttonId == 1) {
      try {
        let productsList = interactiveList;

        productsList.to = process.env.RECIPIENT_PHONE_NUMBER;
        productsList.interactive.action.sections[0].rows = products.map(createProductsList);

        // Listas em mensagens tem um limite de 10 itens no total
        productsList.interactive.action.sections[0].rows.length = 10;
        const sendProductLists = await sendWhatsAppMessage(productsList);
        console.log(sendProductLists);
      } catch (error) {
        console.log(error);
      }
    }
  } else if (interactiveType === "list_reply") {
    const itemId = message.interactive.list_reply.id;
    const itemTitle = message.interactive.list_reply.title;
    const itemDescrption = message.interactive.list_reply.description;
  }
  */
  return;
}

export async function processWaMessage(message: MsgTypes, wb: any, companyId: string) {
  const webhook = await findWebhook({ companyId });

  try {
    if ("text" in message) {
      const textMessage = message.text.body;

      if (webhook) {
        webhookTrigger({
          url: webhook?.url,
          event: Events.MESSAGE_RECEIVED,
          message: textMessage,
          service: "whatsapp",
          metadata: {
            senderPhoneNumber: wb.senderPhoneNumber,
            recipientName: wb.recipientName,
            recipientphoneNumber: wb.recipientPhoneNumberId,
          }
        });
      }

      directLineService.sendMessageToBot("uuid", wb.recipientName, textMessage);

      msgQueue.process(async (job, done) => {
        await sendTextMessage(job.data.msg, wb);
        done();
      });

      /*let replyButtonMessage = interactiveReplyButton;
      replyButtonMessage.to = process.env.RECIPIENT_PHONE_NUMBER;

      const replyButtonSent = await sendWhatsAppMessage(replyButtonMessage);
      console.log(replyButtonSent);*/
      return null;
    } else if ("interactive" in message) {
      // interactiveMessage(message as SendInterativeButton | SendInterativeList);
      return null;
    } else if ("contacts" in message) {
      // TODO      
      return null;
    } else if ("image" in message) {
      // TODO      
      return null;
    } else if ("document" in message) {
      // TODO      
      return null;
    } else {
      // TODO
      return null;
    }
  } catch (error: any) {
    return null;
  }
}