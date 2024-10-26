import { removeEmojis } from "@nlpjs/emoji";
import { DirectlineService, MsgToBot } from "../../../libs/bot/connector/directLine";
import { 
  WebhookEventBase, 
  ReceiveProps, 
  Obj, 
  Attachment, 
  WebhookMsgPostbacks, 
  WebhookMsgReferral, 
  WebhookMsgs } from "../../../types";
import { Platforms } from "../../../types/enums";
import { INSTAGRAM_MSG_TYPE } from "./consumer";

const Receive = class<ReceiveProps> {
  webhookEvent: WebhookEventBase;
  constructor(webhookEvent: WebhookEventBase) {
    this.webhookEvent = webhookEvent;
  }

  async handleTextMessage(msgData: string | Obj) {
    const event = this.webhookEvent as WebhookMsgs;

    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfMessage = event.timestamp;
    
    if (msgData != undefined) {
      const message = msgData.trim().toLowerCase();
      
      const directLineService = DirectlineService.getInstance();

      const msgToSend = removeEmojis(message);

      const conversationId = "conversationId";

      const data: MsgToBot = {
        text: msgToSend,
        id: senderID,
        name: "",
        conversation: conversationId,
        value: {
          senderID,
          recipientID,
          timeOfMessage,
          messageId: event.message.mid,
          metadata: event.message.metadata,
          service: Platforms.INSTAGRAM,
          type: INSTAGRAM_MSG_TYPE.MESSAGE
        }
      };

      directLineService.sendMessageToBot(data); 
    }
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

  handlePostback() {
    let payload: any;
    const event = this.webhookEvent as WebhookMsgPostbacks;

    const postback = event.postback;
    const senderID = event.sender.user_ref;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;

    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      payload = postback.payload;
    }

    // sendTextMessage(senderID, 'Postback called');
    return this.handlePayload(payload.toUpperCase());
  }

  handleReferral() {
    let payload;
    const event = this.webhookEvent as WebhookMsgReferral;

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
