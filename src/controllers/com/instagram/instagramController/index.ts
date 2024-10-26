import { removeEmojis } from "@nlpjs/emoji";
// import { processQuestion } from "../../../../libs/bot/nlp/manager";
import { DirectlineService, MsgToBot } from "../../../../libs/bot/connector/directLine";
import { Obj } from "../../../../types";
import { callSendApi, getUserComment } from "../../service";

export const handlePrivateReply = (type: string, object_id: string, commentId: string) => {
  (async () => {
    const response = await getUserComment(object_id, commentId);

    if (response) {
      const directLineService = DirectlineService.getInstance();
      
      const msgToSend = removeEmojis(response);

      const conversationId = "conversationId";
      const userId = "uuid";

      const data: MsgToBot = {
        text: msgToSend,
        id: userId,
        name: wb.name,
        conversation: conversationId,
        value: omitKeys(wb, ["name"])
      };

      //directLineService.sendMessageToBot(message, userId, name, conversationId);
      directLineService.sendMessageToBot(data);


      
      // const answer = await processQuestion(response);
      
      const requestBody = {
        recipient: {
          [type]: object_id,
        },
        // message: answer,
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
