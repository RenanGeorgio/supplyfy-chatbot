// import { processQuestion } from "../../../libs/trainModel";
// import { sendTextMessage } from "./whatsappController";
// import { MsgProps, SendInterativeButton, SendInterativeList } from "../../../types";

// function interactiveMessage(message: SendInterativeList | SendInterativeButton) {
//   const interactiveType = message.interactive.type;

//   /*
//   if (interactiveType === "button_reply") {
//     const buttonId = message.interactive.button_reply.id;
//     const buttonTitle = message.interactive.button_reply.title;

//     if (buttonId == 1) {
//       try {
//         let productsList = interactiveList;

//         productsList.to = process.env.RECIPIENT_PHONE_NUMBER;
//         productsList.interactive.action.sections[0].rows = products.map(createProductsList);

//         // Listas em mensagens tem um limite de 10 itens no total
//         productsList.interactive.action.sections[0].rows.length = 10;
//         const sendProductLists = await sendWhatsAppMessage(productsList);
//         console.log(sendProductLists);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   } else if (interactiveType === "list_reply") {
//     const itemId = message.interactive.list_reply.id;
//     const itemTitle = message.interactive.list_reply.title;
//     const itemDescrption = message.interactive.list_reply.description;
//   }
//   */
//   return;
// }

// export async function processMessage(message: MsgProps) {
//   const customerPhoneNumber = message.from;
//   const messageType = message.type;

//   try {
//     switch (messageType) {
//       case "text":
//         const textMessage = message.text.body;

//         try {
//           const answer = await processQuestion(textMessage);

//           const response = await sendTextMessage(answer);

//           /*let replyButtonMessage = interactiveReplyButton;
//           replyButtonMessage.to = process.env.RECIPIENT_PHONE_NUMBER;

//           const replyButtonSent = await sendWhatsAppMessage(replyButtonMessage);
//           console.log(replyButtonSent);*/
//         } catch (error) {
//           console.log(error);
//         }
//         break;
//       case "interactive":
//         interactiveMessage(message);
//         break;
//       case "contacts":
//         break;
//       case "image":
//         break;
//       case "document":
//         break;
//       default:
//         break;
//     }
//   } catch (error) {
//     console.log(error);

//     return null;
//   }
// }
