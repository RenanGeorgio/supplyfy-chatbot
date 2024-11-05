import { Platforms } from "../../../types/enums";
import { ENQUEUE_STATUS } from "./enqueue.enums";

type DisconnectDataType = {
  CallSid: string
  Caller: string | undefined
  From: string | undefined
  To: string | undefined
  QueueSid: string
  QueueTime: string
};

export type EventdataType = {
  CallSid: string // id do chat
  Caller: string | undefined // quem está ligando
  From: string | undefined // de onde está ligando
  To: string | undefined // para quem está ligando
  QueuePosition: number | string // posição na fila
  QueueSid: string // id da fila
  QueueTime?: string // tempo na fila
  AvgQueueTime?: string  // tempo medio na fila
  CurrentQueueSize: number | string  // tamanho atual da fila
  MaxQueueSize?: number | string // 100
  channel?: Platforms
}

export interface NotifyAgentDTO {
  eventData: EventdataType;
  filterCompanyId: string; // companyId
  filterQueueId?: string; // queueId da fila de atendimento
}

export interface DisconnectAgentDTO {
  eventData: DisconnectDataType;
  filterCompanyId: string;
}

export interface QueueAgentDTO extends NotifyAgentDTO {
  status: ENQUEUE_STATUS
  deQueuedTime: string | undefined // tempo de desenfileiramento
  queuedTime: string // datetime
}