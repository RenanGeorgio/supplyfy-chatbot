import { Consumer, WebhookEventType, ReceiveProps, Obj, MsgEventProp } from "../../../types";

const Receive = class<ReceiveProps> {
  user: Consumer;
  webhookEvent: WebhookEventType;
  constructor(user: Consumer, webhookEvent: WebhookEventType) {
    this.user = user;
    this.webhookEvent = webhookEvent;
  }

  handleMessage() {
    const event: WebhookEventType = this.webhookEvent;

    let responses;

    try {
      if (event?.postback) {
        responses = this.handlePostback();
      } else if (event?.referral) {
        responses = this.handleReferral();
      } else {
        if (event?.message) {
          const message: Obj = event.message;

          if (message?.is_echo) {
            return;
          } else if (message?.quick_reply) {
            responses = this.handleQuickReply();
          } else if (message?.attachments) {
            responses = this.handleAttachmentMessage();
          } else {
            if (message?.text) {
              responses = this.handleTextMessage();
            } else {
              responses = null;
            }
          }
        } else {
          responses = null;
        }
      }
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
        this.sendMessage(response, delay * 2000);
        delay++;
      }
    } else {
      this.sendMessage(responses);
    }
  }

  handleTextMessage() {
    const msgData: MsgEventProp = this.webhookEvent.message;

    if (msgData) {
      const message = msgData.text.trim().toLowerCase();

      let response;

      if (message.includes("start over") || message.includes("get started") || message.includes("hi")) {
        response = Response.genNuxMessage(this.user);
      } else {
        response = { message: msgData.text };
      }

      return response;
    }

    return null;
  }

  handleAttachmentMessage() {
    const attachment = this.webhookEvent.message.attachments[0];

    const response = Response.genQuickReply(i18n.__("fallback.attachment"), [
      {
        title: i18n.__("menu.help"),
        payload: "CARE_HELP",
      },
      {
        title: i18n.__("menu.start_over"),
        payload: "GET_STARTED",
      },
    ]);

    return response;
  }

  handleQuickReply() {
    const payload = this.webhookEvent.message.quick_reply.payload;

    return this.handlePayload(payload);
  }

  handlePostback() {
    const postback = this.webhookEvent.postback;

    let payload: any;
    if (postback.referral && postback.referral.type == "OPEN_THREAD") {
      payload = postback.referral.ref;
    } else {
      payload = postback.payload;
    }

    return this.handlePayload(payload.toUpperCase());
  }

  handleReferral() {
    const payload = this.webhookEvent.referral.ref.toUpperCase();

    return this.handlePayload(payload);
  }

  handlePayload(payload: string) {
    let response;

    return response;
  }

  handlePrivateReply(type: string, object_id: string) {
    let requestBody = {
      recipient: {
        [type]: object_id,
      },
      message: Response.genText(i18n.__("private_reply.post")),
      tag: "HUMAN_AGENT",
    };

    GraphApi.callSendApi(requestBody);
  }

  sendMessage(response, delay = 0) {
    if ("delay" in response) {
      delay = response["delay"];
      delete response["delay"];
    }

    let requestBody = {
      recipient: {
        id: this.user.igsid,
      },
      message: response,
    };

    setTimeout(() => GraphApi.callSendApi(requestBody), delay);
  }
}

export default Receive;
