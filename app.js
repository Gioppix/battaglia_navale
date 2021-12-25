const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
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
            if(
                games[msg.gamecode].players[games[msg.gamecode].turn ? 1 : 0] == msg.sender &&
                    (
                        games[msg.gamecode].maps[games[msg.gamecode].turn ? 1 : 0]["" + msg.coord.x + msg.coord.y] == undefined ||
                        games[msg.gamecode].maps[games[msg.gamecode].turn ? 1 : 0]["" + msg.coord.x + msg.coord.y] == 2
                    )
                ){
                checkBarca(msg, games[msg.gamecode]);
                msg.map = games[msg.gamecode].maps[games[msg.gamecode].turn ? 1 : 0];
                io.to(msg.gamecode).emit("recivemove", msg);
                games[msg.gamecode].turn = !games[msg.gamecode].turn;
            }
        }
        console.log(msg);
    });
});

function checkBarca(msg, game){
    cellCode = game.maps[game.turn ? 1 : 0]["" + msg.coord.x + msg.coord.y];
    if(cellCode == undefined){
        game.maps[game.turn ? 1 : 0]["" + msg.coord.x + msg.coord.y] = 1
    }
    if(cellCode == 2){
        game.maps[game.turn ? 1 : 0]["" + msg.coord.x + msg.coord.y] = 3
    }
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});

setInterval(() => {
    io.emit('chat message', Date.now()); // This will emit the event to all connected clients
    console.log(games);

}, 3000);