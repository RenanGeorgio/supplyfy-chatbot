import { removeEmojis } from "@nlpjs/emoji";
import { repplyFaceAction, sendFaceAction, sendFacebookMessage } from "../service";
import { FaceMsgData } from "../../../types";
import { DirectlineService } from "../../../libs/bot/connector/directLine";


export function sendFacebookText(recipientId: string, messageText: string) {
  const directLineService = DirectlineService.getInstance();

  const msgToSend = removeEmojis(messageText);
  
  directLineService.sendMessageToBot(msgToSend, userId, name, conversationId);
  directLineService.sendMessageToBot(msgToSend, "uuid", wb.recipientName); 
  
  const messageData: FaceMsgData = {
    recipient: {
      id: recipientId
    },
    messaging_type: 'RESPONSE',
    message: {
      text: responseText,
      metadata: process.env.FACEBOOK_METADATA
    }
  };

  // sendFaceAction(messageData);
  sendFacebookMessage(messageData);
}

export function processComments(comment) { // Processes incoming posts to page to get ID of the poster
  let comment_id: any;

  if (comment.item === "post") {
    comment_id = comment.post_id;
  } else if (comment.item === "comment") {
    comment_id = comment.comment_id;
  }

  const encode_message = encodeURIComponent(comment.message);

  const message_body = `Thank you for your question, to better assist you I am passing you to our support department. Click the link below to be transferred. https://m.me/acmeincsupport?ref=${encode_message}`;
  const request_body = {
    "message": message_body
  };

  repplyFaceAction(comment_id, request_body);
}
