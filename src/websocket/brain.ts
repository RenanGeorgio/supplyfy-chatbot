import { bot_io } from "../core/http";
import socketUsers from "./socketUsers";
import { Platforms } from "../types/enums";

const { io: Client } = require('socket.io-client');

const clientSockets = new Map(); // Store FastAPI connections by client ID

// Handle client connections to the Node.js server
bot_io.on('connection', (socket) => {
    console.log('Client connected to Node.js server');

    // Generate a unique client ID based on socket ID
    const clientId = socket.id;

    // Create a new WebSocket connection to the FastAPI server for this client
    const fastApiSocket = Client('http://localhost:8000', { path: '/ws' }); // Update if FastAPI path or URL differs
    clientSockets.set(clientId, fastApiSocket);

    fastApiSocket.on('connect', () => {
        console.log(`Connected to FastAPI for client: ${clientId}`);
    });

    // Handle messages from FastAPI server and forward to the Node.js client
    fastApiSocket.on('message', (data) => {
        console.log(`Received from FastAPI for client ${clientId}:`, data);
        socket.emit('message', data); // Forward message to the client
    });

    // Handle messages from the client and send to the FastAPI server
    socket.on('message', (message) => {
        console.log(`Received from client ${clientId}:`, message);
        fastApiSocket.emit('message', message); // Forward to FastAPI server
    });

    // Handle client disconnection and close FastAPI connection
    socket.on('disconnect', () => {
        console.log(`Client ${clientId} disconnected`);
        fastApiSocket.close(); // Close the connection to FastAPI server
        clientSockets.delete(clientId); // Remove from map
    });

    // Handle FastAPI WebSocket errors
    fastApiSocket.on('connect_error', (error) => {
        console.error(`FastAPI connection error for client ${clientId}:`, error);
    });
});