import { FREQUENCY, NOTIFICATIONS, TOKENSTATUS } from "../../../helpers/constants";

export type WebhookMsgAccLink = {
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

export type WebhookMsgOptions = {
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

export type WebhookMsgPolicyEnforcement = {
    recipient: {
        id: string;
    };
    timestamp: number;
    policy_enforcement: {
        action: 'warning' | 'block' | 'unblock';
        reason?: string;
    };
}