import { Response } from "express";
import { whatsappCloudApi, instagramApi } from "../../../api";
import { MsgProps } from "../../../types";

export const sendMsg = async (data: MsgProps) => {
  const useWhatsappApi = whatsappCloudApi("v19.0", "+16315551234");

  try {
    const response = await useWhatsappApi("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.bearerToken}`,
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

export const msgStatusChange = async (messageId: string | number) => {
  const data = {
    messaging_product: this.messagingProduct,
    status: 'read',
    //to: this.recipientPhoneNumber,
    message_id: messageId
  }

  const response = await sendMsg(data);

  return response;
}

export const callSendApi = async (requestBody) => {
  const useInstagramApi = instagramApi();

  const response: Response = await useInstagramApi(`/me/messages?access_token=${this.bearerToken}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    console.warn(`Could not sent message.`, response.statusText);
  }
}

export const getUserProfile = async (senderIgsid: string) => {
  const useInstagramApi = instagramApi();

  const response: Response = await useInstagramApi(`/${senderIgsid}?fields=name,profile_pic&access_token=${this.bearerToken}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    let userProfile = await response.json();

    return {
      name: userProfile.name,
      profilePic: userProfile.profile_pic
    };
  } else {
    console.warn(`Could not load profile for ${senderIgsid}: ${response.statusText}`);
  }

  return null;
}

export const setPageSubscriptions = async (pageId: string) => {
  const useInstagramApi = instagramApi();

  const response: Response = await useInstagramApi(`/${pageId}/subscribed_apps?subscribed_fields=feed&access_token=${this.bearerToken}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (response.ok) {
    console.log(`Page subscriptions have been set.`);
  } else {
    console.warn(`Error setting page subscriptions`, response.statusText);
  }
}