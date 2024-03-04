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