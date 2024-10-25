export declare global {
    declare module globalThis {
        var XMLHttpRequest: XMLHttpRequest;
        var WebSocket: WebSocket;
    }
}