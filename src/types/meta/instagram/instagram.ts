import { WebhookMsgFeedback, WebhookMsgGamePlays, WebhookMsgReactions, WebhookSendCart } from "./extras";
import { WebhookMsgHandovers } from "./handovers";
import { WebhookMsgEchoes, WebhookMsgPostbacks, WebhookMsgReferral, WebhookMsgs } from "./messages";
import { WebhookMsgDeliveries, WebhookMsgSee, WebhookStandby } from "./state";
import { WebhookMsgAccLink, WebhookMsgOptions, WebhookMsgPolicyEnforcement } from "./transformers";

type WebhookEventType = WebhookMsgDeliveries | WebhookMsgEchoes | WebhookMsgReactions | WebhookMsgs | WebhookMsgAccLink | WebhookMsgFeedback | WebhookMsgGamePlays | WebhookMsgOptions | WebhookMsgPolicyEnforcement | WebhookMsgPostbacks | WebhookMsgSee | WebhookStandby | WebhookSendCart | WebhookMsgReferral | WebhookMsgHandovers;

export default WebhookEventType;