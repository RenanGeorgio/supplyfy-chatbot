import { Obj } from "../../types";

type Standy = {
    sender: {
        id: string;
        user_ref?: string;
    };
    recipient: {
        id: string;
    };
    message?: Obj | Obj[];
}

export type WebhookMsgDeliveries = {
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

export type WebhookMsgReads = {
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

export type WebhookMsgSee = {
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