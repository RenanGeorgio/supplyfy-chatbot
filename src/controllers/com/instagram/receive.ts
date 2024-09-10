import { processQuestion } from "../../../libs/bot/nlp/manager";
import Response, { processMessage } from "./processMessage";
import { 
  Consumer, 
  WebhookEventBase, 
  ReceiveProps, 
  Obj, 
  Attachment, 
  WebhookMsgPostbacks, 
  WebhookMsgReferral, 
  WebhookMsgs } from "../../../types";
import { sendMessage } from "./instagramController";

const Receive = class<ReceiveProps> {
  user: Consumer;
  webhookEvent: WebhookEventBase;
  constructor(user: Consumer, webhookEvent: WebhookEventBase) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleMessage() {
    // @ts-ignore
    const event: WebhookMsgPostbacks | WebhookMsgReferral | WebhookMsgs = this.webhookEvent;

    let responses: Obj = {};

    try {
      responses = processMessage(event, this);
    } catch (error) {
      responses = {
        text: `An error has occured: '${error}'. We have been notified and \
        will fix the issue shortly!`,
      };
    }

    if (!responses) {
      return;
    }

    if (Array.isArray(responses)) {
      let delay = 0;
      for (let response of responses) {
        sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      sendMessage(responses);
    }
  }

  async handleTextMessage(msgData: string) {
    if (msgData != undefined) {
      const message = msgData.trim().toLowerCase();

      let response;

      if (message.includes("start over") || message.includes("get started") || message.includes("hi")) {
        if (this.user != undefined) {
          response = Response.genNuxMessage(this.user);
        }
      } else {
        const answer = await processQuestion(msgData);
        response = { message: answer };
      }

      return response;
    }

    return null;
  }

  handleAttachmentMessage() {
    let response: any;

    // @ts-ignore
    if (this?.webhookEvent?.message != undefined) {
      // @ts-ignore
      const attachment: Attachment = this.webhookEvent.message.attachments[0];

      /*response = Response.genQuickReply(i18n.__("fallback.attachment"), [
        {
          title: i18n.__("menu.help"),
          payload: "CARE_HELP",
        },
        {
         title: i18n.__("menu.start_over"),
          payload: "GET_STARTED",
        },
      ]);*/
    }

    return response;
  }

  handleQuickReply() {
    // @ts-ignore
    const payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  handlePostback(event: WebhookMsgPostbacks) {
    let payload: any;

    if (event!= undefined) {
      const postback = event.postback;
      const senderID = event.sender.user_ref;
      const recipientID = event.recipient.id;
      const timeOfPostback = event.timestamp;

      if (postback.referral && postback.referral.type == "OPEN_THREAD") {
        payload = postback.referral.ref;
      } else {
        payload = postback.payload;
      }
    }

    // sendTextMessage(senderID, 'Postback called');
    return this.handlePayload(payload.toUpperCase());
  }

  handleReferral(event: WebhookMsgReferral) {
    let payload;

    if (event.referral.ref != undefined) {
      payload = event.referral.ref.toUpperCase();
    }

    return this.handlePayload(payload);
  }

  handlePayload(payload: string) {
    let response;

    return response;
  }
}

export default Receive;
