import { Obj } from "./types";

export type statUses = Obj & {
    read: {
        messaging_product: string;
        status: string;
        message_id: string;
        [key: string]?: any;
    }
}