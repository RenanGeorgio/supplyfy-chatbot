import { WebhookEventType } from "./whatsapp";

export type Obj = {
    [key: string]: any;
}

export type statUses = Obj & {
    read: {
        messaging_product: string;
        status: string;
        message_id: string;
        [key: string]?: any;
    }
}

export interface Consumer {
    igsid: string | number;
    name?: string | undefined;
    profilePic?: any | undefined;
};

export type ReceiveProps = {
    user: Consumer;
    webhookEvent: WebhookEventType;
}