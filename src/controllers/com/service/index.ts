import { Response } from "express";
import { facebookApi, instagramApi } from "../../../api";
import { FaceMsgData, MsgProps, Obj } from "../../../types";

export const sendMsg = async (data: MsgProps, wb: any) => {
  try {
    console.log("send message called")

    const response = await wb.useWhatsappApi("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${wb.getAccessToken()}`,
      },
      data: data,
    });
    console.log(data)

    if (response) {
      return response;
    }
    else {
      return null;
    }
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export const msgStatusChange = async (messageId: string | number, wb: any) => {
  const data = {
    messaging_product: "whatsapp",
    status: 'read',
    message_id: messageId
  }

  const response = await sendMsg(data, wb);

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

export const sendFaceAction = (message: FaceMsgData) => {
  const useFacebookApi = facebookApi();

  (async () => {
    let response: Response | undefined;
    try {
      response = await useFacebookApi(`/me/messages?access_token=${process.env.ACCESS_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(message)
      });

      if (response?.statusCode == 200) {
        console.log("Success");
      }
    } catch (error: any) {
      console.error("Failed calling Send API", response?.statusCode, response?.statusMessage, error);
    }
  })();
  
  return;
}

export const repplyFaceAction = (comment_id: string, message: Obj) => {
  const useFacebookApi = facebookApi();

  (async () => {
    let response: Response | undefined;
    try {
      response = await useFacebookApi(`/${comment_id}/private_replies?access_token=${process.env.ACCESS_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify(message)
      });

      if (response) {
        console.log("Success");
      }
    } catch (error: any) {
      console.error("Failed calling Send API", response?.statusCode, response?.statusMessage, error);
    }
  })();
  
  return;
}