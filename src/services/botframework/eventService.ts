import { sendFacebookTextMessage } from "../../controllers/com/facebook/facebookController";
import { sendInstagramMessage } from "../../controllers/com/service";
import { sendWaTextMessage } from "../../controllers/com/whatsapp/whatsappController";
import { Obj, WaMsgMetaData } from "../../types";
import { Platforms } from "../../types/enums";
import { enqueue } from "../enqueue";
import { ENQUEUE_STATUS } from "../enqueue/constants/enqueue.enums";
import { EventdataType, QueueAgentDTO } from "../enqueue/constants/enqueue.types";

const CurrentEvent = class<EventdataType> {
    CallSid: string | undefined
    Caller: string | undefined 
    From: string | undefined 
    To: string | undefined 
    QueuePosition: number | string | undefined
    QueueSid: string | undefined
    CurrentQueueSize: number | undefined
    MaxQueueSize?: number | string
    channel?: Platforms
    constructor(maxSize: number = 100) {
      this.MaxQueueSize = maxSize;
    }
  
    setCurrentEvent({ CallSid, Caller, From, To, QueuePosition, QueueSid, CurrentQueueSize, channel }: EventdataType) {
        this.CallSid = CallSid;
        this.Caller = Caller;
        this.From = From;
        this.To = To;
        this.QueuePosition = QueuePosition;
        this.QueueSid = QueueSid
        this.CurrentQueueSize = CurrentQueueSize;
        this.channel = channel;
    }

    getCurrentEvent() {
        return this;
    }
  };

export default async function eventService(data: any) {
    try {
        const { result } = data;
        
        const channel = result.value.channel;

        const currentEvent = new CurrentEvent();

        switch (channel) {
            case Platforms.WHATSAPP:
                const whatsappData: WaMsgMetaData = {
                    senderPhoneNumberId: result.value.phoneNumberId,
                    senderPhoneNumber: result.value.phoneNumber,
                    recipientName: result.value.name,
                    recipientPhoneNumberId: result.value.to,
                    accessToken: result.value.token,
                };

                const whatsappEvent: EventdataType = { 
                    CallSid: result.conversation.id, 
                    Caller: result.from.name, 
                    From: result.from.id, 
                    To: result.value.to, 
                    QueuePosition: -1, 
                    QueueSid: "", 
                    CurrentQueueSize: -1, 
                    channel: Platforms.WHATSAPP
                 }

                currentEvent.setCurrentEvent(whatsappEvent);


                sendWaTextMessage(result.text, whatsappData);
                break;
            case Platforms.INSTAGRAM:
                const instagramEvent: EventdataType = { 
                    CallSid: result.conversation.id, 
                    Caller: result.from.name, 
                    From: result.from.id, 
                    To: result.value.to, 
                    QueuePosition: -1, 
                    QueueSid: "", 
                    CurrentQueueSize: -1, 
                    channel: Platforms.WHATSAPP
                 }

                currentEvent.setCurrentEvent(instagramEvent);

                sendInstagramMessage(responses);
                break;
            case Platforms.FACEBOOK:
                const facebookEvent: EventdataType = { 
                    CallSid: result.conversation.id, 
                    Caller: result.from.name, 
                    From: result.from.id, 
                    To: result.value.to, 
                    QueuePosition: -1, 
                    QueueSid: "", 
                    CurrentQueueSize: -1, 
                    channel: Platforms.WHATSAPP
                 }

                currentEvent.setCurrentEvent(facebookEvent);

                sendFacebookTextMessage(result.value.senderID, result.text);
                break;
            default:
                console.log('Tipo de atendimento desconhecido.');
                break;
        }

        const eventToSend: Obj = currentEvent.getCurrentEvent();

        const newData: QueueAgentDTO = {
            eventData: eventToSend as any,
            filterCompanyId: result.value.company,
            filterQueueId: result.value.queue,
            status: ENQUEUE_STATUS.QUEUED,
            deQueuedTime: undefined,
            queuedTime: new Date().toString()
        }

        enqueue(newData);

        return result
    } catch (error: any) {
        throw new Error("Error sending message");
    }
}