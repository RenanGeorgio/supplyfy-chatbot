import { whatsappCloudApi } from "../../api";
import { MsgProps } from "../../types";

export const sendMsg = async (data: MsgProps) => {
  try {
    const response = await whatsappCloudApi("/messages", {
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