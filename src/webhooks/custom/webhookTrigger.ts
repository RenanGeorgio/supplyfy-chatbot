import axios from "axios";

export const webhookTrigger = async ({ url, event, service, message, metadata = {} }) => {
  try {
    await axios.post(url, {
      data: {
        event,
        service,
        message,
        dateTime: new Date().toISOString(),
        metadata
      },
    });
  } catch (error: any) {
    if("code" in error) {
      console.error(`Webhook Error ${error.code}`);
    }
    else {
      console.error(`Webhook Error: ${error.message}`);
    }
  }
};