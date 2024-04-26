import { Response } from "express";
import { instagramApi } from "../../../api";
import { FaceMsgData, MsgProps, Obj, SendFaceMsgBody } from "../../../types";

export const sendMsg = async (data: MsgProps, useWhatsappApi: any) => {
  try {
    const response = await useWhatsappApi("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
      data: data,
    });

    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const msgStatusChange = async (messageId: string | number, wbApi: any) => {
  const data = {
    messaging_product: "whatsapp",
    status: 'read',
    //to: this.recipientPhoneNumber,
    message_id: messageId
  }

  const response = await sendMsg(data, wbApi);

  return response;
}

export const callSendApi = async (requestBody: Obj) => {
  const useInstagramApi = instagramApi();

  const response: Response = await useInstagramApi(`/me/messages?access_token=${process.env.ACCESS_TOKEN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(requestBody)
  });

  // @ts-ignore
  if (!response?.ok) {
    console.warn(`Could not sent message.`, response);
  }
}

export const getUserProfile = async (senderIgsid: string) => {
  const useInstagramApi = instagramApi();

  const response: Response = await useInstagramApi(`/${senderIgsid}?fields=name,profile_pic&access_token=${process.env.ACCESS_TOKEN}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response) {
    let userProfile = await response.json();

    // @ts-ignore
    return { name: userProfile.name, profilePic: userProfile.profile_pic };
  } else {
    console.warn(`Could not load profile for ${senderIgsid}: ${response}`);
  }

  return null;
}

export const getUserComment = async (senderIgsid: string, commentId: string) => {
  const useInstagramApi = instagramApi();

  const response: Response = await useInstagramApi(`/${senderIgsid}?fields=mentioned_comment.comment_id(${commentId})&access_token=${process.env.ACCESS_TOKEN}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response) {
    const value = await response.json();

    // @ts-ignore
    return value.mentioned_comment.text;
  } else {
    console.warn(`Could not load profile for ${senderIgsid}: ${response}`);
  }

  return null;
}

export const setPageSubscriptions = async (pageId: string) => {
  const useInstagramApi = instagramApi();

  const response: Response = await useInstagramApi(`/${pageId}/subscribed_apps?subscribed_fields=feed&access_token=${process.env.ACCESS_TOKEN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response) {
    console.log(`Page subscriptions have been set.`);
  } else {
    console.warn(`Error setting page subscriptions`, response);
  }
}

export const sendFaceAction = (messageData: FaceMsgData) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error: any, response: Response, body: SendFaceMsgBody) {
    if (!error && response.statusCode == 200) {
      const recipientId = body.recipient_id;
      const messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
      } else {
        console.log("Successfully called Send API for recipient %s", recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}