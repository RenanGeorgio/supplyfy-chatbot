import { processQuestion } from "../../../../libs/trainModel";
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