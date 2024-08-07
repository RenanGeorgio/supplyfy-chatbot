import { repplyFaceAction, sendFaceAction } from "../service";
import { FaceMsgData } from "../../../types";
// import { processQuestion } from "../../../libs/bot/nlp/manager";

export function sendFacebookText(recipientId: string, messageText: string) {
  // const data = processQuestion(messageText);
  const data = "test"
  const messageData: FaceMsgData = {
    recipient: {
      id: recipientId
    },
    messaging_type: 'RESPONSE',
    message: {
      text: data,
      metadata: process.env.FACEBOOK_METADATA
    }
  };

  sendFaceAction(messageData);
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