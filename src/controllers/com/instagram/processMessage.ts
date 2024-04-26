import { Consumer, MsgEventProp, Obj, WebhookEventBase } from "../../../types";
import { sendAccountLinking, sendAudioMessage, sendButtonMessage, sendFileMessage, sendGenericMessage, sendGifMessage, sendImageMessage, sendQuickReply, sendReadReceipt, sendReceiptMessage, sendTextMessage, sendTypingOff, sendTypingOn, sendVideoMessage } from "./instagramController/data";
import Receive from "./instagramController/receive";

export default class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: [],
    };

    for (let quickReply of quickReplies) {
      // @ts-ignore
      response["quick_replies"].push({ content_type: "text", title: quickReply["title"], payload: quickReply["payload"] });
    }

    return response;
  }

  static genImage(url) {
    let response = {
      attachment: {
        type: "image",
        payload: {
          url: url,
        },
      },
    };

    return response;
  }

  static genText(text) {
    let response = {
      text: text,
    };

    return response;
  }

  static genPostbackButton(title, payload) {
    let response = {
      type: "postback",
      title: title,
      payload: payload,
    };

    return response;
  }

  static genGenericTemplate(image_url, title, subtitle, buttons) {
    let response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: title,
              subtitle: subtitle,
              image_url: image_url,
              buttons: buttons,
            },
          ],
        },
      },
    };

    return response;
  }

  static genNuxMessage(user: Consumer) {

    return [];
  }
};

export async function processMessage(event: WebhookEventBase, receive: any) {
  let responses: any;

  if ("postback" in event) {
    responses = receive.handlePostback(event?.postback);
  } else if ("referral" in event) {
    responses = receive.handleReferral(event?.referral);
  } else {
    // @ts-ignore
    if (event?.message != undefined) {
      const message: MsgEventProp = event?.message;

      if ("is_echo" in message) {
        return null;
      } else if ("quick_reply" in message) {
        responses = receive.handleQuickReply();
      } else if ("attachments" in message) {
        responses = receive.handleAttachmentMessage();
      } else if (("text" in message) && (message?.text != undefined)) {
        const messageText: string | Obj = message.text;
        
        switch (messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
          case 'image':
            responses = sendImageMessage(receive.user.igsid, process.env.SERVER_URL + "/assets/rift.png");
            break;
          case 'gif':
            responses = sendGifMessage(receive.user.igsid);
            break;
          case 'audio':
            responses = sendAudioMessage(receive.user.igsid);
            break;
          case 'video':
            responses = sendVideoMessage(receive.user.igsid);
            break;
          case 'file':
            responses = sendFileMessage(receive.user.igsid);
            break;
          case 'button':
            responses = sendButtonMessage(receive.user.igsid);
            break;
          case 'generic':
            responses = sendGenericMessage(receive.user.igsid);
            break;
          case 'receipt':
            responses = sendReceiptMessage(receive.user.igsid);
            break;
          case 'quick reply':
            responses = sendQuickReply(receive.user.igsid);
            break;
          case 'read receipt':
            responses = sendReadReceipt(receive.user.igsid);
            break;
          case 'typing on':
            responses = sendTypingOn(receive.user.igsid);
            break;
          case 'typing off':
            responses = sendTypingOff(receive.user.igsid);
            break;
          case 'account linking':
            responses = sendAccountLinking(receive.user.igsid);
            break;
          default:
            const data = receive.handleTextMessage(messageText);
            responses = sendTextMessage(receive.user.igsid, data.message);
            break;
        }
      } else {
        responses = null
      }
    }
  }

  return responses;
}