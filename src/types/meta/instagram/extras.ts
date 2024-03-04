import { Obj } from "../../types";

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

type Product = {
    id: number | string;
    retailer_id: string;
    name: string;
    unit_price: number;
    currency: string;
    quantity: number;
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