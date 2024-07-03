import { DirectLine } from "botframework-directlinejs";

const directLine = new DirectLine({
  secret: /* put your Direct Line secret here */,
  token: /* or put your Direct Line token here (supply secret OR token, not both) */,
  domain: /* optional: if you are not using the default Direct Line endpoint, e.g. if you are using a region-specific endpoint, put its full URL here */
  webSocket: /* optional: false if you want to use polling GET to receive messages. Defaults to true (use WebSocket). */,
  pollingInterval: /* optional: set polling interval in milliseconds. Defaults to 1000 */,
  timeout: /* optional: a timeout in milliseconds for requests to the bot. Defaults to 20000 */,
  conversationStartProperties: { /* optional: properties to send to the bot on conversation start */
      locale: 'en-US'
  }
});