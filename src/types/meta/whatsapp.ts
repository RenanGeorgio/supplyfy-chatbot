import { Obj, ContactsData } from "../types";

type Buttons = {
    type: 'reply' | undefined;
    reply: {
        id: string | number;
        title: string;
    }
}

interface DataProps {
    messaging_product: string;
    recipient_type?: string;
    preview_url?: boolean;
    to: string | number;
    type: "text";
};

export interface SendText extends DataProps {
    text: {
        preview_url?: boolean;
        body: string | any;
    }
};

export interface SendInterativeButton extends DataProps {
    interactive: {
        type: 'button' | undefined;
        body: {
            text: string;
        },
        action: {
            buttons: Buttons[];
        }
    }
};

export interface SendInterativeList extends DataProps {
    interactive: {
        type: 'list' | undefined;
        header: {
            type: 'text' | undefined;
            text?: string;
        };
        body?: {
            text: string;
        };
        footer?: {
            text: string;
        };
        action: {
            button: string;
            sections: Obj[];
        }
    }
};

export interface SendContacts extends DataProps {
    contacts: ContactsData[] | Obj[] | string[];
};

export interface SendImg extends DataProps {
    image: {
        link: string;
        caption: string;
    }
};

export interface SendDoc extends DataProps {
    document: {
        caption: string;
        filename: string;
        id: number | string;
    }
};

export interface MsgStatus {
    messaging_product: string;
    status: string;
    to?: string | number;
    message_id: number | string;
};

export type MsgProps = MsgStatus | SendDoc | SendImg | SendContacts | SendInterativeList | SendInterativeButton | SendText