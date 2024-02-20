type Obj = {
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
export const messageStatuses: statUses = {
    read : {
        messaging_product: "whatsapp",
        status: "read",
        message_id: ""
    }
};