const DATA_MENSAGENS_TYPES = [
    "text",
    "interactive",
    "contacts",
    "image",
    "document"
];

type Obj = {
    [key: string]: any;
}

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
    contacts: Obj[] | string[];
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

const contactsData = [
    {
        addresses: [
            {
                street: "123 Main Street",
                city: "Cityville",
                state: "Stateville",
                zip: "12345",
                country: "Countryland",
                country_code: "CL",
                type: "HOME"
            }
        ],
        birthday: "1990-01-01",
        emails: [
            {
                email: "example@example.com",
                type: "WORK"
            }
        ],
        name: {
            formatted_name: "John Doe",
            first_name: "John",
            last_name: "Doe",
            middle_name: "Middle",
            suffix: "Jr.",
            prefix: "Mr."
        },
        org: {
            company: "Example Company",
            department: "Sales",
            title: "Manager"
        },
        phones: [
            {
                phone: "+1234567890",
                wa_id: "1234567890",
                type: "HOME"
            }
        ],
        urls: [
            {
                url: "https://www.example.com",
                type: "WORK"
            }
        ]
    }
];