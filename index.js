const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Maintain a list of connected clients
const clients = [];

wss.on('connection', (socket) => {
  console.log('A new client connected');

  // Add the client to the list
  clients.push(socket);

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const data = { message };
        console.log(`broadcasting...`, data);
        client.send(JSON.stringify(data));
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');

    // Remove the client from the list
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
