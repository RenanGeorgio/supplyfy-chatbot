import { Obj } from "../../types";

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

export type WebhookMsgEchoes = {
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

export type MsgEventProp = {
    mid: string;
    is_echo?: boolean;
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

export type WebhookMsgs = {
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

export type WebhookMsgPostbacks = {
    field: any;
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
}

export type WebhookMsgReferral = {
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