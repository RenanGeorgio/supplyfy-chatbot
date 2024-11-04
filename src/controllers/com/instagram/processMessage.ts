import { 
  sendInstagramAccountLinking, 
  sendInstagramAudioMessage, 
  sendInstagramButtonMessage, 
  sendInstagramFileMessage, 
  sendInstagramGenericMessage, 
  sendInstagramGifMessage, 
  sendInstagramImageMessage, 
  sendInstagramQuickReply, 
  sendInstagramReadReceipt, 
  sendInstagramReceiptMessage, 
  sendInstagramTextMessage, 
  sendInstagramTypingOff, 
  sendInstagramTypingOn, 
  sendInstagramVideoMessage 
} from "./instagramController/data";
import Receive from "./receive";
import { Consumer, MsgEventProp, Obj, WebhookEventBase } from "../../../types";


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

export function processMessage(event: WebhookEventBase): void {
  const receive = new Receive(event);

  if ("postback" in event) {
    receive.handlePostback();
  } else if ("referral" in event) {
    receive.handleReferral();
  } else {
    // @ts-ignore
    if (event?.message != undefined) {
      // @ts-ignore
      const message: MsgEventProp = event?.message;

      if ("is_echo" in message) {
        console.log(message);
      } else if ("quick_reply" in message) {
        receive.handleQuickReply();
      } else if ("attachments" in message) {
        receive.handleAttachmentMessage();
      } else if (("text" in message) && (message?.text != undefined)) {
        const messageText: string | Obj = message.text;
        /*switch (messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
          case 'image':
            responses = sendInstagramImageMessage(receive.user.igsid, process.env.SERVER_URL + "/assets/rift.png");
            break;
          case 'gif':
            responses = sendInstagramGifMessage(receive.user.igsid);
            break;
          case 'audio':
            responses = sendInstagramAudioMessage(receive.user.igsid);
            break;
          case 'video':
            responses = sendInstagramVideoMessage(receive.user.igsid);
            break;
          case 'file':
            responses = sendInstagramFileMessage(receive.user.igsid);
            break;
          case 'button':
            responses = sendInstagramButtonMessage(receive.user.igsid);
            break;
          case 'generic':
            responses = sendInstagramGenericMessage(receive.user.igsid);
            break;
          case 'receipt':
            responses = sendInstagramReceiptMessage(receive.user.igsid);
            break;
          case 'quick reply':
            responses = sendInstagramQuickReply(receive.user.igsid);
            break;
          case 'read receipt':
            responses = sendInstagramReadReceipt(receive.user.igsid);
            break;
          case 'typing on':
            responses = sendInstagramTypingOn(receive.user.igsid);
            break;
          case 'typing off':
            responses = sendInstagramTypingOff(receive.user.igsid);
            break;
          case 'account linking':
            responses = sendInstagramAccountLinking(receive.user.igsid);
            break;
          default:
            const data = receive.handleTextMessage(messageText);
            responses = sendInstagramTextMessage(receive.user.igsid, data.message);
            break;
        }*/
        
        receive.handleTextMessage(messageText);
      }
    }
  }
}