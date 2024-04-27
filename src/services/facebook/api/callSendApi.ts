import graphApi from "./graphApi";

export default async ({ credentials, message }) => {
  return await graphApi(`/${credentials.pageId}/messages`, {
    method: "POST",
    data: {
      recipient: { id: message.senderId },
      messaging_type: "RESPONSE",
      message: {
        text: message.text,
      },
    },
    params: {
      access_token: credentials.pageToken,
    },
  });
};
