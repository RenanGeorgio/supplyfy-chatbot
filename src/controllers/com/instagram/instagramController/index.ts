import { removeEmojis } from "@nlpjs/emoji";
import { DirectlineService, MsgToBot } from "../../../../libs/bot/connector/directLine";
import { getUserComment } from "../../service";
import { INSTAGRAM_MSG_TYPE } from "../consumer";
import { Platforms } from "../../../../types/enums";

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
        name: "",
        conversation: conversationId,
        value: {
          key: type,
          objectId: object_id,
          service: Platforms.INSTAGRAM,
          type: INSTAGRAM_MSG_TYPE.PRIVATEREPLY
        }
      };

      directLineService.sendMessageToBot(data);
    }
  })();

  return;
}