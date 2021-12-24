const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
app.use(express.static("public")); //gli manda i file

games = []

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    socket.on('startGame', (msg) => {
        games.push({
            name: msg,
        });
        console.log(msg);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

setInterval(() => {
    io.emit('chat message', Date.now()); // This will emit the event to all connected sockets

}, 1000);