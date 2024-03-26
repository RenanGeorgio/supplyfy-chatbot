// import { processQuestion } from "../../../../libs/trainModel";
// import { callSendApi, getUserComment } from "../../service";
// import { 
//   sendImageMessage, 
//   sendGifMessage, 
//   sendAudioMessage, 
//   sendVideoMessage, 
//   sendFileMessage, 
//   sendButtonMessage, 
//   sendGenericMessage, 
//   sendReceiptMessage, 
//   sendQuickReply, 
//   sendReadReceipt, 
//   sendTypingOn, 
//   sendTypingOff, 
//   sendAccountLinking, 
//   sendTextMessage } from "./data";
// import { 
//   Consumer, 
//   WebhookEventBase, 
//   ReceiveProps, 
//   Obj, 
//   MsgEventProp, 
//   Attachment, 
//   WebhookMsgPostbacks, 
//   WebhookMsgReferral, 
//   WebhookMsgs } from "../../../../types";

// const Receive = class<ReceiveProps> {
//   user?: Consumer;
//   webhookEvent?: WebhookEventBase;
//   constructor(user?: Consumer, webhookEvent?: WebhookEventBase) {
//     this.user = user;
//     this.webhookEvent = webhookEvent;
//   }

//   handleMessage() {
//     const event: WebhookEventBase | undefined | any = this.webhookEvent;

//     let responses: Obj = {};

//     try {
//       if (event?.postback) {
//         responses = this.handlePostback(event?.postback);
//       } else if (event?.referral) {
//         responses = this.handleReferral(event?.referral);
//       } else {
//         if (event?.message) {
//           const message: MsgEventProp = event.message;

//           if (message?.is_echo) {
//             console.log("Received echo for message %s and app %d with metadata %s", message?.mid, message?.app_id, message?.metadata);
//             return;
//           } else if (message?.quick_reply) {
//             responses = this.handleQuickReply();
//           } else if (message?.attachments) {
//             responses = this.handleAttachmentMessage();
//           } else {
//             if (message?.text) {
//               const messageText = message.text;

//               let data: Obj = {};
              
//               switch (messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
//                 case 'image':
//                   data = sendImageMessage(this.user.igsid, process.env.SERVER_URL + "/assets/rift.png");
//                   responses = data;
//                   break;
//                 case 'gif':
//                   data = sendGifMessage(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'audio':
//                   data = sendAudioMessage(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'video':
//                   data = sendVideoMessage(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'file':
//                   data = sendFileMessage(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'button':
//                   data = sendButtonMessage(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'generic':
//                   data = sendGenericMessage(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'receipt':
//                   data = sendReceiptMessage(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'quick reply':
//                   data = sendQuickReply(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'read receipt':
//                   data = sendReadReceipt(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'typing on':
//                   data = sendTypingOn(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'typing off':
//                   data = sendTypingOff(this.user.igsid);
//                   responses = data;
//                   break;
//                 case 'account linking':
//                   data = sendAccountLinking(this.user.igsid);
//                   responses = data;
//                   break;
//                 default:
//                   data = this.handleTextMessage(this.webhookEvent);
//                   responses = sendTextMessage(this.user.igsid, data.message);
//               }
//             }
//           }
//         }
//       }
//     } catch (error) {
//       responses = {
//         text: `An error has occured: '${error}'. We have been notified and \
//         will fix the issue shortly!`,
//       };
//     }

//     if (!responses) {
//       return;
//     }

//     if (Array.isArray(responses)) {
//       let delay = 0;
//       for (let response of responses) {
//         this.sendMessage(response, delay * 2000);
//         delay++;
//       }
//     } else {
//       this.sendMessage(responses);
//     }
//   }

//   async handleTextMessage(event: WebhookMsgs) {
//     const msgData: MsgEventProp = event.message;

//     if ((msgData) && (msgData?.text != undefined)) {
//       const message = msgData.text.trim().toLowerCase();

//       let response;

//       if (message.includes("start over") || message.includes("get started") || message.includes("hi")) {
//         response = Response.genNuxMessage(this.user);
//       } else {
//         const answer = await processQuestion(msgData.text);

//         response = { message: answer };
//       }

//       return response;
//     }

//     return null;
//   }

//   handleAttachmentMessage() {
//     const attachment: Attachment = this.webhookEvent.message.attachments[0];

//     const response = Response.genQuickReply(i18n.__("fallback.attachment"), [
//       {
//         title: i18n.__("menu.help"),
//         payload: "CARE_HELP",
//       },
//       {
//         title: i18n.__("menu.start_over"),
//         payload: "GET_STARTED",
//       },
//     ]);

//     return response;
//   }

//   handleQuickReply() {
//     const payload = this.webhookEvent.message.quick_reply.payload;

//     return this.handlePayload(payload);
//   }

//   handlePostback(event: WebhookMsgPostbacks) {
//     const postback = event.value.postback;
//     const senderID = event.value.sender.user_ref;
//     const recipientID = event.value.recipient.id;
//     const timeOfPostback = event.value.timestamp;

//     let payload: any;
//     if (postback.referral && postback.referral.type == "OPEN_THREAD") {
//       payload = postback.referral.ref;
//     } else {
//       payload = postback.payload;
//     }


//     // sendTextMessage(senderID, 'Postback called');
//     return this.handlePayload(payload.toUpperCase());
//   }

//   handleReferral(event: WebhookMsgReferral) {
//     const payload = event.referral.ref.toUpperCase();

//     return this.handlePayload(payload);
//   }

//   handlePayload(payload: string) {
//     let response;

//     return response;
//   }

//   async handlePrivateReply(type: string, object_id: string, commentId: string) {
//     const response = await getUserComment(object_id, commentId);

//     if (response) {
//       const answer = await processQuestion(response);

//       const requestBody = {
//         recipient: {
//           [type]: object_id,
//         },
//         message: answer,
//         tag: "HUMAN_AGENT",
//       };

//       await callSendApi(requestBody);
//     }
//   }

//   sendMessage(response: Obj, delay = 0) {
//     const value = response.message;

//     if ("delay" in response) {
//       delay = response["delay"];
//       delete response["delay"];
//     }

//     /*const requestBody = {
//       recipient: {
//         id: this.user.igsid,
//       },
//       message: response
//     };*/

//     const requestBody = response;

//     setTimeout(async () => {
//       await callSendApi(requestBody)
//     }, delay);
//   }
// }

// export default Receive;
