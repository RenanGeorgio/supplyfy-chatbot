import { Obj } from "../../types";

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