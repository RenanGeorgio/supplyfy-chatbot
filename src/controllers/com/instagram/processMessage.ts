import { Consumer } from "../../../types/types";

class Response {
  static genQuickReply(text, quickReplies) {
    let response = {
      text: text,
      quick_replies: [],
    };

    for (let quickReply of quickReplies) {
      response["quick_replies"].push({
        content_type: "text",
        title: quickReply["title"],
        payload: quickReply["payload"],
      });
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
