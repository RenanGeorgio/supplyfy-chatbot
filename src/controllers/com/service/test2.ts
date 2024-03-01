
const config = require("./config"),
  fetch = require("node-fetch"),
  { URL, URLSearchParams } = require("url");

export const callSendApi = async (requestBody) => {
  let url = new URL(`${config.apiUrl}/me/messages`);
  url.search = new URLSearchParams({
    access_token: config.pageAccesToken
  });
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) {
    console.warn(`Could not sent message.`, response.statusText);
  }
}

export const getUserProfile = async (senderIgsid) => {
  let url = new URL(`${config.apiUrl}/${senderIgsid}`);
  url.search = new URLSearchParams({
    access_token: config.pageAccesToken,
    fields: "name,profile_pic"
  });
  let response = await fetch(url);
  if (response.ok) {
    let userProfile = await response.json();
    return {
      name: userProfile.name,
      profilePic: userProfile.profile_pic
    };
  } else {
    console.warn(
      `Could not load profile for ${senderIgsid}: ${response.statusText}`
    );
    return null;
  }
}

export const setIcebreakers = async (iceBreakers) => {
  let url = new URL(`${config.apiUrl}/me/messenger_profile`);
  url.search = new URLSearchParams({
    access_token: config.pageAccesToken
  });
  let json = {
    platform: "instagram",
    ice_breakers: iceBreakers
  };
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  });
  if (response.ok) {
    console.log(`Icebreakers have been set.`);
  } else {
    console.warn(`Error setting ice breakers`, response.statusText);
  }
}

export const setPersistentMenu =  async (persistentMenu) => {
  let url = new URL(`${config.apiUrl}/me/messenger_profile`);
  url.search = new URLSearchParams({
    access_token: config.pageAccesToken
  });
  let json = {
    platform: "instagram",
    persistent_menu: persistentMenu
  };
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  });
  if (response.ok) {
    console.log(`Persistent Menu has been set.`);
  } else {
    console.warn(`Error setting Persistent Menu`, response.statusText);
  }
}

export const setPageSubscriptions = async () => {
  let url = new URL(`${config.apiUrl}/${config.pageId}/subscribed_apps`);
  url.search = new URLSearchParams({
    access_token: config.pageAccesToken,
    subscribed_fields: "feed"
  });
  let response = await fetch(url, {
    method: "POST"
  });
  if (response.ok) {
    console.log(`Page subscriptions have been set.`);
  } else {
    console.warn(`Error setting page subscriptions`, response.statusText);
  }
}