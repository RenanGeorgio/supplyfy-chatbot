import { Response, NextFunction } from "express";
import { CustomRequest } from "../../helpers/customRequest";
import { processQuestion } from "../../helpers/trainModel";

export const markMessageAsRead = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { messageId } = req.body;

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                status: 'read',
                //to: this.recipientPhoneNumber,
                message_id: messageId
            },
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendTextMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { messageText } = req.body;

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                recipient_type: "individual",
                to: this.recipientPhoneNumber,
                type: "text",
                text: {
                    preview_url: false,
                    body: messageText
                },
            },
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendButtonsMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { messageText, buttonsList } = req.body;

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                recipient_type: "individual",
                to: this.recipientPhoneNumber,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: messageText
                    },
                    action: {
                        buttons: buttonsList.map(button => ({
                            type: "reply",
                            reply: {
                                id: button.id,
                                title: button.title,
                            }
                        }))
                    }
                }
            },
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendContacts = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { contactsList } = req.body;

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                to: this.recipientPhoneNumber,
                type: "contacts",
                contacts: contactsList
            }
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendRadioButtons = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { headerText, bodyText, footerText, sectionsList } = req.body;

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                recipient_type: "individual",
                to: this.recipientPhoneNumber,
                type: "interactive",
                interactive: {
                    type: "list",
                    header: {
                        type: "text",
                        text: headerText
                    },
                    body: {
                        text: bodyText
                    },
                    footer: {
                        text: footerText
                    },
                    action: {
                        button: "Select from the list",
                        sections: sectionsList
                    }
                }
            }
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendImageByLink = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { imageLink, caption } = req.body;

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                recipient_type: "individual",
                to: this.recipientPhoneNumber,
                type: "image",
                image: {
                    link: imageLink,
                    caption: caption
                }
            },
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const uploadMedia = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { filePath } = req.body;

        const data = new FormData();
        data.append("messaging_product", this.messagingProduct);
        data.append("file", fs.createReadStream(filePath));

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`,
                ...data.getHeaders()
            },
            data: data
        });

        if (response.status === 200) {
            return res.status(200).send({ message: response.data.id });
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};

export const sendDocumentMessage = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { documentPath, caption } = req.body;

        const docId = await this.uploadMedia(documentPath);

        const response = await whatsappCloudAp("/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.bearerToken}`
            },
            data: {
                messaging_product: this.messagingProduct,
                recipient_type: "individual",
                to: this.recipientPhoneNumber,
                type: "document",
                document: {
                    caption: caption,
                    filename: documentPath.split('./')[1],
                    id: docId
                }
            },
        });

        if (response.status === 200) {
            return res.status(200).send(response);
        }

        return res.status(501).send({ message: "Server problem" });
    } catch (error) {
        next(error);
    }           
};