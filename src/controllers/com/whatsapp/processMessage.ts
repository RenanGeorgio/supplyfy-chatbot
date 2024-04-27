import { processQuestion } from "../../../libs/trainModel";
import { sendTextMessage } from "./whatsappController";
import { SendContacts, SendDoc, SendImg, SendInterativeButton, SendInterativeList, SendText } from "../../../types";

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
  const customerPhoneNumber = message.from;

  try {
    if ("text" in message) {
      const textMessage = message.text.body;

      try {
        const answer = await processQuestion(textMessage);

        const response = await sendTextMessage(answer, wb);

        /*let replyButtonMessage = interactiveReplyButton;
        replyButtonMessage.to = process.env.RECIPIENT_PHONE_NUMBER;

        const replyButtonSent = await sendWhatsAppMessage(replyButtonMessage);
        console.log(replyButtonSent);*/
      } catch (error) {
        console.log(error);
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
  } catch (error) {
    console.log(error);

    return null;
  }
}
