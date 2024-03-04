import { Obj } from "../types";
import { FREQUENCY, NOTIFICATIONS, TOKENSTATUS } from "../../helpers/constants";

type EventMessaging = {
    sender: { id: string; };
    recipient: { id: string; },
}

type WebhookEventBase = {
    object: string;
    entry: {
        id: string;
        time: number;
        messaging: EventMessaging[];
    }[];
}

export type Attachment = {
    type: 'audio' | 'file' | 'image' | 'video' | 'fallback' | 'reel';
    payload: {
        url?: string;
        title?: string;
        sticker_id?: number;
        reel_video_id?: number;
        product?: {
            elements?: {
                id: string | number;
                retailer_id: string | number;
                image_url?: string;
                title: string;
                subtitle?: string;
            }[];
        };
    };
}

type feedbackScreens = {
    screen_id: number | string;
    questions: {
        [key: string]: {
            id?: string;
            type: string;
            payload: string;
            follow_up: {
                type: string;
                payload: string;
            };
        };
    }[];
}

type Standy = {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    message?: Obj;
}

type Product = {
    id: number | string;
    retailer_id: string;
    name: string;
    unit_price: number;
    currency: string;
    quantity: number;
}

export type WebhookMsgDeliveries = WebhookEventBase & {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    delivery: {
        mids: string[];
        watermark: number;
        seq?: number | string;
    };
}

export type WebhookMsgEchoes = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    message: {
        is_echo: boolean;
        app_id: number;
        metadata?: string;
        mid: string;
        [key: string]: any;
    };
}

export type WebhookMsgReactions = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    reaction: {
        reaction: 'smile' | 'angry' | 'sad' | 'wow' | 'love' | 'like' | 'dislike' | 'other';
        emoji: string;
        action: 'react' | 'unreact';
        mid: string;
    };
}

export type WebhookMsgReads = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    read: {
        watermark: number;
    };
}

export type MsgEventProp = {
    mid: string;
    text?: string | Obj;
    metadata?: string;
    commands?: {
        name: string;
    }[];
    quick_reply?: {
        payload: string;
    };
    reply_to?: {
        mid: string;
    };
    referral?: {
        product: {
            id: string;
        };
    };
    attachments?: Attachment[];
}

export type WebhookMsgs = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    message: MsgEventProp;
}

export type WebhookMsgAccLink = WebhookEventBase & {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    account_linking: {
        status: 'linked' | 'unlinked';
        authorization_code: string;
    };
}

export type WebhookMsgFeedback = Omit<WebhookEventBase, 'entry'> & {
    entry: {
        time: number;
        messaging: {
            sender: {
                id: string;
            };
            recipient: {
                id: string;
            };
            messaging_feedback: {
                feedback_screens: feedbackScreens;
            };
        }[];
    };
}

export type WebhookMsgGamePlays = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    game_play: {
        game_id: string;
        player_id: string;
        locale: string;
        context_type: 'GROUP' | 'SOLO' | 'THREAD';
        context_id: string;
        score: number;
        payload: Obj;
    };
}

export type WebhookMsgOptions = WebhookEventBase & {
    sender: {
        id: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    optin: {
        type: 'notification_messages'; 
        payload?: string;
        notification_messages_token: string; 
        notification_messages_frequency?: FREQUENCY;  
        notification_messages_timezone: string;
        token_expiry_timestamp: any;
        user_token_status: TOKENSTATUS;  
        notification_messages_status: NOTIFICATIONS;
        title: string; 
    };
}

export type WebhookMsgPolicyEnforcement = WebhookEventBase & {
    recipient: {
        id: string;
    };
    timestamp: number;
    policy_enforcement: {
        action: 'warning' | 'block' | 'unblock';
        reason?: string;
    };
}

export type WebhookMsgPostbacks = WebhookEventBase & {
    field: any;
    value: {
        sender: {
          user_ref: string;
        };
        recipient: {
          id: string;
        };
        timestamp: string | number;
        postback: {
          mid: string | number;
          title: string;
          payload?: any;
          referral?: {
            ref: any;
            source: string;
            type: 'OPEN_THREAD' | string;
          };
        };
    };
}

export type WebhookMsgSee = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    read: {
        watermark: number;
        seq?: number | string;
    };
}

export type WebhookStandby = Omit<WebhookEventBase, 'entry'> & {
    entry: {
        id: string;
        time: number | string;
        standby: Standy[];
    }[];
}

export type WebhookSendCart = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp?: number;
    order: {
        products: Product[];
        note?: string;
    };
}

export type WebhookMsgReferral = WebhookEventBase & {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    timestamp: number;
    referral: {
        ref?: string;
        source: 'ADS' | 'SHORTLINK' | 'CUSTOMER_CHAT_PLUGIN';
        type: 'OPEN_THREAD';
        referer_uri?: string;
        is_guest_user?: string;
        ads_context_data?: {
            ad_title: string;
            photo_url?: string;
            video_url?: string;
            post_id: string | number;
            product_id?: string;
        };
    };
}

type MsghHandovers = WebhookEventBase & {
    sender?: {
        id: string;
        user_ref?: string;
    };
    recipient?: {
        id: string;
    };
    timestamp: number;
}

type HandoversPassThreadControl = MsghHandovers & {
    pass_thread_control: {
        previous_owner_app_id: string;
        new_owner_app_id: string | number;
        metadata: string;
    };
}

type HandoversTakeThreadControl = MsghHandovers & {
    take_thread_control: {
        previous_owner_app_id: string | null;
        new_owner_app_id: string;
        metadata: string;
    };
}

type HandoversRequestThreadControl = MsghHandovers & {
    request_thread_control: {
        requested_owner_app_id: string | number;
        metadata: string;
    };
}

type HandoversAppRoles = MsghHandovers & {
    app_roles: Obj;
}

export type WebhookMsgHandovers = HandoversPassThreadControl | HandoversTakeThreadControl | HandoversRequestThreadControl | HandoversAppRoles;

export type WebhookEventType = WebhookMsgDeliveries | WebhookMsgEchoes | WebhookMsgReactions | WebhookMsgs | WebhookMsgAccLink | WebhookMsgFeedback | WebhookMsgGamePlays | WebhookMsgOptions | WebhookMsgPolicyEnforcement | WebhookMsgPostbacks | WebhookMsgSee | WebhookStandby | WebhookSendCart | WebhookMsgReferral | WebhookMsgHandovers;