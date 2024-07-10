import { DirectLine, ConnectionStatus } from "botframework-directlinejs";
import { Observable, Subject } from "../../../node_modules/rxjs";
import { msgQueuev2 } from "../../queue";

const directLine = new DirectLine({
  secret: /* put your Direct Line secret here */,
  token: /* or put your Direct Line token here (supply secret OR token, not both) */,
  domain: /* optional: if you are not using the default Direct Line endpoint, e.g. if you are using a region-specific endpoint, put its full URL here */,
  webSocket: true,
  pollingInterval: /* optional: set polling interval in milliseconds. Defaults to 1000 */,
});

export class DirectlineService {
  constructor() {
    directLine.connectionStatus$.subscribe(connectionStatus => {
      switch (connectionStatus) {
        case ConnectionStatus.Uninitialized: // the status when the DirectLine object is first created/constructed
        case ConnectionStatus.Connecting: // currently trying to connect to the conversation
        case ConnectionStatus.Online: // successfully connected to the converstaion. Connection is healthy so far as we know.
        case ConnectionStatus.ExpiredToken: // last operation errored out with an expired token. Your app should supply a new one.
        case ConnectionStatus.FailedToConnect: // the initial attempt to connect to the conversation failed. No recovery possible.
        case ConnectionStatus.Ended: // the bot ended the conversation
      }
    });
  }

  public sendMessageToBot(id: string, name?: string, text: string) {
    directLine
      .postActivity({
        from: { id: id, name: name },
        type: 'message',
        text: text
      })
      .subscribe(
        id => console.log("Posted activity, assigned ID ", id),
        error => console.log('Error posting activity', error)
      );
  }

  public subscribeBot(botName: string): void {
    directLine.activity$
      .filter(activity => activity.type === 'message' && activity.from.id === botName)
      .subscribe(
        message => {
          console.log(message);
          msgQueuev2.add({ msg: message });
        }
      )
  }
}