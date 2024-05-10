import { NextFunction, Response, Request } from "express";
import { 
    receivedAccountLink, 
    receivedAuthentication, 
    receivedDeliveryConfirmation, 
    receivedMessage, 
    receivedMessageRead, 
    receivedPostback 
} from "./received";
import { processComments } from "./processMessage";
import { FaceMessagingEvent, PageEntry } from "../../../types";

export const eventsHandler = async (
    req: Request,
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

            res.status(200).send("EVENT_RECEIVED");
        } else {
            res.status(404).send();  
        }
    } catch (error: any) {
        next(error)
    }
};