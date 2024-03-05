import { WebhookMsgFeedback, WebhookMsgGamePlays, WebhookMsgReactions, WebhookSendCart } from "./extras";
import { WebhookMsgHandovers } from "./handovers";
import { WebhookMsgEchoes, WebhookMsgPostbacks, WebhookMsgReferral, WebhookMsgs } from "./messages";
import { WebhookMsgDeliveries, WebhookMsgSee, WebhookStandby, WebhookMsgReads } from "./state";
import { WebhookMsgAccLink, WebhookMsgOptions, WebhookMsgPolicyEnforcement } from "./transformers";

type EventMessaging = 
    | WebhookMsgEchoes 
    | WebhookMsgs 
    | WebhookMsgPostbacks 
    | WebhookMsgReferral;

type EventExtras = 
    | WebhookMsgGamePlays 
    | WebhookMsgReactions 
    | WebhookSendCart 
    | WebhookMsgFeedback;

type EventState = 
    | WebhookMsgDeliveries 
    | WebhookMsgSee 
    | WebhookMsgReads;

type EventTrans = 
    | WebhookMsgAccLink 
    | WebhookMsgOptions 
    | WebhookMsgPolicyEnforcement;

export type WebhookEventBase = EventMessaging | EventExtras | EventState | EventTrans | WebhookMsgHandovers;

export type WebhookEventType = {
    object: 'page' | 'instagram' | undefined;
    entry: {
        id: string;
        time: number;
        messaging: WebhookEventBase[];
    }[] | WebhookStandby[];
}