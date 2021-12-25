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

games = new Map();

io.on('connection', (client) => {
    console.log('a user connected');
    client.on('disconnect', () => {
        console.log('user disconnected');
    });
    client.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    client.on('startGame', (msg) => {
        client.join(msg.gamecode);
        if(games[msg.gamecode]){
            games[msg.gamecode].second = msg.sender;
        }else{
            games[msg.gamecode] = msg;
            games[msg.gamecode].turn = msg.sender;
        }
    });
    client.on('move', (msg) => {
        if(games[msg.gamecode]){
            if(games[msg.gamecode].turn == msg.sender){
                //io.to(msg.gamecode).emit("recivemove", msg.coord);
            }
        }
        io.to(msg.gamecode).emit("recivemove", msg.coord);
        console.log(msg.coord);
    });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

setInterval(() => {
    io.emit('chat message', Date.now()); // This will emit the event to all connected clients
    if(games["ciao"]){
        console.log(games)
    }

}, 3000);