import { processQuestion } from "../../../../libs/bot/nlp/manager";
import { Obj } from "../../../../types";
import { callSendApi, getUserComment } from "../../service";

export const handlePrivateReply = (type: string, object_id: string, commentId: string) => {
  (async () => {
    const response = await getUserComment(object_id, commentId);

    if (response) {
      const answer = await processQuestion(response);
      
      const requestBody = {
        recipient: {
          [type]: object_id,
        },
        message: answer,
        tag: "HUMAN_AGENT",
      };
  
      await callSendApi(requestBody);
    }
  })();

  return;
}

export const sendMessage = (response: Obj, delay = 0) => {
  if ("delay" in response) {
    delay = response["delay"];
    delete response["delay"];
  }

  const requestBody = response;

  setTimeout(async () => {
    await callSendApi(requestBody)
  }, delay);

  return;
}
