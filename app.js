const express = require('express');
const { createServer } = require('http');
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// })

// undef = vuoto non scoperto, 1 = vuoto scoperto, 2 = barca non scoperta, 3 = barca scopertas 4 = barca affondata

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
            games[msg.gamecode].players.push(msg.sender);
            games[msg.gamecode].maps.push(msg.map);
            io.to(msg.gamecode).emit("turn", games[msg.gamecode].players[games[msg.gamecode].turn ? 1 : 0]);
        }else{
            games[msg.gamecode] = {};
            games[msg.gamecode].players = []
            games[msg.gamecode].gamecode = msg.gamecode;
            games[msg.gamecode].players.push(msg.sender);
            games[msg.gamecode].turn = true;
            games[msg.gamecode].maps = [];
            games[msg.gamecode].maps.push(msg.map);
        }
    });
    client.on('move', (msg) => {
        if(games[msg.gamecode]){
            mapPointer = games[msg.gamecode].maps[!games[msg.gamecode].turn ? 1 : 0];
            if(
                games[msg.gamecode].players[games[msg.gamecode].turn ? 1 : 0] == msg.sender &&
                    (
                        mapPointer["" + msg.coord.x + msg.coord.y] == undefined ||
                        mapPointer["" + msg.coord.x + msg.coord.y] == 2
                    )
                ){
                checkBarca(msg.coord, mapPointer);
                msg.map = games[msg.gamecode].maps[!games[msg.gamecode].turn ? 1 : 0];
                io.to(msg.gamecode).emit("recivemove", msg);
                games[msg.gamecode].turn = !games[msg.gamecode].turn;
                io.to(msg.gamecode).emit("turn", games[msg.gamecode].players[games[msg.gamecode].turn ? 1 : 0]);
            }
        }
        console.log(msg);
    });
});

function checkBarca(coord, map){
    cellCode = map["" + coord.x + coord.y];
    if(cellCode == undefined){
        map["" + coord.x + coord.y] = 1
    }
    if(cellCode == 2){
        map["" + coord.x + coord.y] = 3
    }
}

server.listen(process.env.PORT || 3000, () => {
  console.log('listening');
});

setInterval(() => {
    io.emit('chat message', Date.now()); // This will emit the event to all connected clients
    console.log(games);

}, 3000);