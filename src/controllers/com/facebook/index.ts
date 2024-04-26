import { NextFunction, Response } from "express";
import { CustomRequest, FaceMessagingEvent, PageEntry } from "../../../types";
import { facebookApi } from "../../../api";
import { processQuestion } from "../../../libs/trainModel";
import { receivedAccountLink, receivedAuthentication, receivedDeliveryConfirmation, receivedMessage, receivedMessageRead, receivedPostback } from "./received";
import { processComments } from "./processMessage";

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
            const events = data.entry[0].messaging;

            for (let i = 0; i < events.length; i++) {
                var event = events[i];
                console.log(event)

                if (event.message && event.message.text) {
                    const response = await facebookApi("/v19.0/" + process.env.FACEBOOK_PAGE_ID + "messages?access_token=" + process.env.FACEBOOK_ACCESS_TOKEN, {
                        method: "POST",
                        data: {
                            recipient: { id: event.sender.id },
                            messaging_type: "RESPONSE",
                            message: {
                                text: processQuestion(event.message.text)
                            }
                        }
                    });

                    if (response.status === 200){
                        console.log(response)
                    }           
                }
            }

            res.status(200).send("EVENT_RECEIVED");
        } else {
            res.status(404).send();  
        }
    } catch (error: any) {
        next(error)
    }
};