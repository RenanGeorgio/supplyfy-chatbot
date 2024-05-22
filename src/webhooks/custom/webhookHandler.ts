import { webhookTrigger } from "./webhookTrigger";

export const webhookPromiseHandler = (url: string, promise) => {
  Promise.resolve(promise).then((result) => {
    if (result) {
      webhookTrigger({
        url,
        event: result.event,
        message: result.message,
        service: result.service,
      });
    }
  });
};