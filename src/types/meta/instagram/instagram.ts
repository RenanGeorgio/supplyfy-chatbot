import { WebhookMsgFeedback, WebhookMsgGamePlays, WebhookMsgReactions, WebhookSendCart } from "./extras";
import { WebhookMsgHandovers } from "./handovers";
import { WebhookMsgEchoes, WebhookMsgPostbacks, WebhookMsgReferral, WebhookMsgs } from "./messages";
import { WebhookMsgDeliveries, WebhookMsgSee, WebhookMsgReads } from "./state";
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

export type EntryProps = {
    id?: string | number;
    time?: number | string;
    messaging?: WebhookEventBase[];
};

export type WebhookEventType = {
    object: 'page' | 'instagram' | undefined;
    entry: EntryProps[];
}