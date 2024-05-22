import axios from "axios";

export const webhookTrigger = async ({ url, event, service, message }) => {
  try {
    await axios.post(url, {
      data: {
        event,
        service,
        message,
        dateTime: new Date().toISOString()
      },
    });
  } catch (error) {
    // console.error(error);
  }
};