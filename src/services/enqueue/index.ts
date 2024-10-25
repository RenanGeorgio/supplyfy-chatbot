import { CALL_STATUS, ENQUEUE_STATUS } from "./constants/enqueue.enums";
import { NotifyAgentDTO, QueueAgentDTO } from "./constants/enqueue.types";

export const enqueue = async ({ params, data }) => {
  try {
    const newData: QueueAgentDTO = {
      ...data,
      status: ENQUEUE_STATUS.QUEUED,
      deQueuedTime: undefined,
      queuedTime: new Date().toString(),
    };
    // adicionado  o endpoint do servidor
    const result = await fetch("/send-msg", {
      method: "POST",
      body: JSON.stringify(newData),
    });
  } catch (error) {
    console.error(error);
  }
};
