import { FaceMsgData } from "../../../types";

export function sendFacebookText(recipientId: string, messageText: string) {
  const messageData: FaceMsgData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: 'DEVELOPER_DEFINED_METADATA'
    }
  };

  callSendAPI(messageData);
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

  request({
      "uri": `https://graph.facebook.com/v2.12/${comment_id}/private_replies`,
      "qs": {"access_token": access_token},
      "method": "POST",
      "json": request_body
  }, (err, res) => {
      if (!err) {
          console.log("Private reply sent");
      }
  });
}