import { processQuestion } from "../../../libs/trainModel";
import { sendTextMessage } from "./whatsappController";
import { SendContacts, SendDoc, SendImg, SendInterativeButton, SendInterativeList, SendText } from "../../../types";
import { webhookTrigger } from "../../../webhooks/custom/webhookTrigger";
import { Events } from "../../../types/enums";
import WhatsappService from "../../../services/whatsapp";
import { findUserByField } from "../../../repositories/user";
import { findWebhook } from "../../../repositories/webhook";
import { findBot } from "../../../helpers/findBot";
import { botExist } from "../../../repositories/bot";

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

export async function processMessage(message: MsgTypes, wb: any) {
  const customerPhoneNumber = wb.getRecipientPhoneNumberId();
  const companyPhoneNumber = wb.getSenderPhoneNumberId();
  try {
    console.log("BOT ID: ", companyPhoneNumber)
    console.log("SENDER ID: ", customerPhoneNumber)

    const bots = await botExist("services.whatsapp.numberId", companyPhoneNumber)
    if (!bots){
      throw new Error("Bot não encontrado")
    }

    const companyId = bots.companyId

    const webhook = await findWebhook({ companyId })
    console.log("WEBHOOK: ", webhook?.url)

    if ("text" in message) {
      const textMessage = message.text.body;

      try {
        if (webhook) {
          webhookTrigger({
            url: webhook?.url,
            event: Events.MESSAGE_RECEIVED,
            message: textMessage,
            service: "whatsapp",
          });
        }
        const answer = await processQuestion(textMessage);

        await sendTextMessage(answer, wb);

        if (webhook) {
          webhookTrigger({
            url: webhook?.url,
            event: Events.MESSAGE_SENT,
            message: answer,
            service: "whatsapp",
          });
        }
        /*let replyButtonMessage = interactiveReplyButton;
        replyButtonMessage.to = process.env.RECIPIENT_PHONE_NUMBER;

        const replyButtonSent = await sendWhatsAppMessage(replyButtonMessage);
        console.log(replyButtonSent);*/
        return null;
      } catch (error: any) {
        throw new Error(error?.message)
      }
    } else if ("interactive" in message) {
      interactiveMessage(message as SendInterativeButton | SendInterativeList);
    } else if ("contacts" in message) {
      // TODO
    } else if ("image" in message) {
      // TODO
    } else if ("document" in message) {
      // TODO
    } else {
      // TODO
    }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
