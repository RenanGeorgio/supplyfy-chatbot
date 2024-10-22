import { NextFunction, Response } from "express";
import { 
    receivedAccountLink, 
    receivedAuthentication, 
    receivedDeliveryConfirmation, 
    receivedMessage, 
    receivedMessageRead, 
    receivedPostback 
} from "./received";
import { processComments } from "./processMessage";
import { CustomRequest, FaceMessagingEvent, PageEntry } from "../../../types";

export const eventsHandler = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const data = req.body;

    try {
        if (data.object === "page") {
            data.entry.forEach(function(entry: PageEntry) {
                const pageID = entry.id;
                const timeOfEvent = entry.time;

                if (entry.messaging) {
                    entry.messaging.forEach(function(messagingEvent: FaceMessagingEvent) {
                        if (messagingEvent.optin) {
                            receivedAuthentication(messagingEvent);
                        } else if (messagingEvent.message) {
                            receivedMessage(messagingEvent);
                        } else if (messagingEvent.delivery) {
                            receivedDeliveryConfirmation(messagingEvent);
                        } else if (messagingEvent.postback) {
                            receivedPostback(messagingEvent);
                        } else if (messagingEvent.read) {
                            receivedMessageRead(messagingEvent);
                        } else if (messagingEvent.account_linking) {
                            receivedAccountLink(messagingEvent);
                        } else {
                            console.log('Webhook received unknown messagingEvent: ', messagingEvent);
                        }
                    });
                }  else if (entry?.changes) {
                    processComments(entry?.changes[0].value);
                }
            });
            // return res.status(200).send("EVENT_RECEIVED");
            return;
        }
    } catch (error: any) {
        next(error)
    }
};
