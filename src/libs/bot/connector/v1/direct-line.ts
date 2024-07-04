import Swagger from "swagger-client";
import * as rp from "request-promise";
import * as directLineSpec from "./directline-swagger.json";
import { msgQueuev1, msgQueuev2 } from "../../queue";

const directLineSecret = 'DIRECTLINE_SECRET';

// directLineUserId is the field that identifies which user is sending activities to the Direct Line service.
// Because this value is created and sent within your Direct Line client, your bot should not
// trust the value for any security-sensitive operations. Instead, have the user log in and
// store any sign-in tokens against the Conversation or Private state fields. Those fields
// are secured by the conversation ID, which is protected with a signature.
const directLineUserId = 'DirectLineClient';

const useW3CWebSocket = false;

const directLineClient = new Swagger(
    {
        spec: directLineSpec,
        usePromise: true,
    })
    .then(function (client) { // Obtain a token using the Direct Line secret
        return rp({
            url: 'https://directline.botframework.com/v3/directline/tokens/generate',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + directLineSecret
            },
            json: true            
        }).then(function (response) { // Then, replace the client's auth secret with the new token
            const token = response.token;
            client.clientAuthorizations.add('AuthorizationBotConnector', new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + token, 'header'));
            return client;            
        });
    })
    .catch(function (err) {
        console.error('Error initializing DirectLine client', err);
        throw err;
    });

function printMessages(activities) {
    if (activities && activities.length) { // Ignore own messages
        activities = activities.filter(function (m) { return m.from.id !== directLineUserId });

        const text = activities[0].texttrim().toLocaleLowerCase(); // tentar pegar so a mais recente
        msgQueuev2.add({ msg: text });
    }
}

export class DirectlineService {
    private directline: any;

    constructor() {
        this.directline = directLineClient;

        this.start();
    }

    private start() { // Once the client is ready, create a new conversation 
        this.directline.then(function (client) {
            client.Conversations.Conversations_StartConversation()
                .then(function (response) {
                    const responseObj = response.obj;

                    // Start console input loop from stdin
                    sendMessagesFromConsole(client, responseObj.conversationId);

                    if (useW3CWebSocket) { // Start receiving messages from WS stream - using W3C client
                        startReceivingW3CWebSocketClient(responseObj.streamUrl, responseObj.conversationId);
                    } else { // Start receiving messages from WS stream - using Node client
                        startReceivingWebSocketClient(responseObj.streamUrl, responseObj.conversationId);
                    }
                }
            );
        });
    }

    public sendMessagesFromConsole(client, conversationId) {
        msgQueuev1.process(async (job, done) => {
            const input = job.data.msg;
            const text = input.trim().toLocaleLowerCase();

            if (text) {
                if (text === 'exit') {
                    done();
                }

                client.Conversations.Conversations_PostActivity(
                    {
                        conversationId: conversationId,
                        activity: {
                            textFormat: 'plain',
                            text: text,
                            type: 'message',
                            from: {
                                id: directLineUserId,
                                name: directLineUserId
                            }
                        }
                    }
                ).catch(function (err) {
                    console.error('Error sending message:', err);
                });
            }
        });
    }

    public startReceivingWebSocketClient(streamUrl, conversationId) {
        console.log('Starting WebSocket Client for message streaming on conversationId: ' + conversationId);

        const ws = new (require('websocket').client)();

        ws.on('connectFailed', function (error) {
            console.log('Connect Error: ' + error.toString());
        });

        ws.on('connect', function (connection) {
            console.log('WebSocket Client Connected');

            connection.on('error', function (error) {
                console.log("Connection Error: " + error.toString());
            });

            connection.on('close', function () {
                console.log('WebSocket Client Disconnected');
            });

            connection.on('message', function (message) {
                // Occasionally, the Direct Line service sends an empty message as a liveness ping
                // Ignore these messages
                if (message.type === 'utf8' && message.utf8Data.length > 0) {
                    const data = JSON.parse(message.utf8Data);
                    printMessages(data.activities);
                    // var watermark = data.watermark;
                }
            });
        });

        ws.connect(streamUrl);
    }

    public startReceivingW3CWebSocketClient(streamUrl, conversationId) {
        console.log('Starting W3C WebSocket Client for message streaming on conversationId: ' + conversationId);

        const ws = new (require('websocket').w3cwebsocket)(streamUrl);

        ws.onerror = function () {
            console.log('Connection Error');
        };

        ws.onopen = function () {
            console.log('W3C WebSocket Client Connected');
        };

        ws.onclose = function () {
            console.log('W3C WebSocket Client Disconnected');
        };

        ws.onmessage = function (e) {
            // Occasionally, the Direct Line service sends an empty message as a liveness ping
            // Ignore these messages
            if (typeof e.data === 'string' && e.data.length > 0) {
                const data = JSON.parse(e.data);
                printMessages(data.activities);
                // var watermark = data.watermark;
            }
        };
    }    
}