import { removeEmojis } from "@nlpjs/emoji";
import { repplyFaceAction } from "../service";
import { DirectlineService, MsgToBot } from "../../../libs/bot/connector/directLine";
import { Obj } from "../../../types";
import { Platforms } from "../../../types/enums";


export function sendFacebookText(info: Obj, messageText: string) {
  const {
    senderID,
    recipientID,
    timeOfMessage,
    messageId,
    appId,
    metadata
  } =  info;

  const directLineService = DirectlineService.getInstance();

  const msgToSend = removeEmojis(messageText);

  const conversationId = "conversationId";

  const data: MsgToBot = {
    text: msgToSend,
    id: recipientID,
    name: "",
    conversation: conversationId,
    value: {
      senderID,
      recipientID,
      timeOfMessage,
      messageId,
      appId,
      metadata,
      service: Platforms.FACEBOOK,
    }
  };
  
  directLineService.sendMessageToBot(data); 
}

// TO-DO: Voltar aqui
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
