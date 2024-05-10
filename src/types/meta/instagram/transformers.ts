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
        notification_messages_frequency?: string;  
        notification_messages_timezone: string;
        token_expiry_timestamp: any;
        user_token_status: string;  
        notification_messages_status: string;
        title: string; 
        ref?: any;
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