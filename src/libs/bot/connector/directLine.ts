import { DirectLine, ConnectionStatus } from "botframework-directlinejs";
import { ActivityTypes } from "botbuilder";
import { randomUUID } from "crypto";
import queue from "../../Queue";

const directLine = new DirectLine({
    secret: process.env.DIRECT_LINE_SECRET,
    webSocket: true
});

export class DirectlineService {
    static _instance: DirectlineService;

    constructor() {
        directLine.connectionStatus$.subscribe(connectionStatus => {
            switch (connectionStatus) {
                case ConnectionStatus.Uninitialized: 
                    console.log("The status when the DirectLine object is first created/constructed.")
                    return;
                case ConnectionStatus.Connecting: 
                    console.log("Currently trying to connect to the conversation.")
                    return;
                case ConnectionStatus.Online: 
                    console.log("Successfully connected to the conversation. Connection is healthy so far as we know.")
                    return;
                case ConnectionStatus.ExpiredToken: 
                    console.log("Last operation errored out with an expired token. Your app should supply a new one.")
                    return;
                case ConnectionStatus.FailedToConnect: 
                    console.log("The initial attempt to connect to the conversation failed. No recovery possible.")
                    return;
                case ConnectionStatus.Ended: 
                    console.log("The bot ended the conversation.")
                    return;
            }
        });
    }


    public sendMessageToBot(text: string, id: string, name: string = "Anonymous", value?: object) {
        // TO-DO: ID Precisa ser conciso é unico dentre os usuarios ativos
        directLine
            .postActivity({
                from: { id, name },
                // conversation?: { id: string },
                type: ActivityTypes.Message,
                // eTag?: string,
                // id: "ignai-bot", // TO-DO: lookup ou Hash -> datetime-zone
                text: text,
                // ...(value ? { value } : {}),
            }).subscribe(
                (value: any) => console.log("Posted message activity. " + value),
                (error: any) => console.log('Error posting activity: ' + error?.message),
                () => console.log("Activity completed."),
            );
    }

    public subscribeBot(botName: string = "ignai-bot"): void {
        directLine.activity$
            .filter(activity => activity.type === ActivityTypes.Message && activity.from.id === botName)
            .subscribe(
                (message) => {
                    console.log("Activity added to BotService queue.")
                    queue.add("BotService", { message });
                }
            )
    }

    static getInstance(): DirectlineService {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new DirectlineService();
        return this._instance;
    }
}