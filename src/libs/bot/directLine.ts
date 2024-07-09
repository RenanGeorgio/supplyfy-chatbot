import { DirectLine, ConnectionStatus } from "botframework-directlinejs";
import { ActivityTypes } from "botbuilder";

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
                    console.log("the status when the DirectLine object is first created/constructed")
                    return;
                case ConnectionStatus.Connecting: 
                    console.log("currently trying to connect to the conversation")
                    return;
                case ConnectionStatus.Online: 
                    console.log("successfully connected to the converstaion. Connection is healthy so far as we know.")
                    return;
                case ConnectionStatus.ExpiredToken: 
                    console.log("last operation errored out with an expired token. Your app should supply a new one.")
                    return;
                case ConnectionStatus.FailedToConnect: 
                    console.log("the initial attempt to connect to the conversation failed. No recovery possible.")
                    return;
                case ConnectionStatus.Ended: 
                    console.log("the bot ended the conversation")
                    return;
            }
        });
    }

    public sendMessageToBot(id: string, name?: string, text?: string) {
        directLine
            .postActivity({
                from: { id, name },
                type: ActivityTypes.Message,
                text: text
            })
            .subscribe(
                (value: any) => { 
                    console.log("Posted message activity")
                    return console.log(value)
                },
                (error: any) => console.log('Error posting activity: ' + error?.message)
            );
    }

    public subscribeBot(botName: string): void {
        directLine.activity$
            .filter(activity => activity.type === ActivityTypes.Message && activity.from.id === botName)
            .subscribe(
                (message) => {
                    queue.add("BotService", { message });
                }
            )
    }

    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new DirectlineService();
        return this._instance;
    }
}

