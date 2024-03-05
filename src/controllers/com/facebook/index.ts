import { Response, NextFunction } from "express";
import { CustomRequest } from "../helpers/customRequest";
import facebookApi from "./facebookApi";
import { processQuestion } from "../helpers/trainModel";

export const events = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.body.object === "page") {
            const events = req.body.entry[0].messaging;
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
                            },
                        },
                    });
                    if (response.status === 200){
                        console.log(response)
                    }           
                }
            }
            return res.status(200).send("EVENT_RECEIVED");
        }
        else{
            return res.status(404).send();  
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
};