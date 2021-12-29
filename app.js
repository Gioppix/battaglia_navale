const express = require('express');
const res = require('express/lib/response');
const { createServer } = require('http');
const { getPriority } = require('os');
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// })

// undef = vuoto non scoperto, 1 = vuoto scoperto, 2 = barca non scoperta, 3 = barca scopertas 4 = barca affondata
// 0 = da cominciare, 1 = ocminciato, 2 = finito

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
            if(games[msg.gamecode].players.lenght != 2){
                games[msg.gamecode].status = 1;
                games[msg.gamecode].players.push(msg.sender);
                games[msg.gamecode].maps.push(msg.map);
                io.to(msg.gamecode).emit("turn", games[msg.gamecode].players[games[msg.gamecode].turn ? 1 : 0]);
            }
        }else{
            games[msg.gamecode] = {};
            games[msg.gamecode].status = 0;
            games[msg.gamecode].players = [];
            games[msg.gamecode].gamecode = msg.gamecode;
            games[msg.gamecode].players.push(msg.sender);
            games[msg.gamecode].turn = true;
            games[msg.gamecode].maps = [];
            games[msg.gamecode].maps.push(msg.map);
        }
    });
    client.on('move', (msg) => {
        if(games[msg.gamecode].status == 1){
            mapPointer = games[msg.gamecode].maps[!games[msg.gamecode].turn ? 1 : 0];
            if(
                games[msg.gamecode].players[games[msg.gamecode].turn ? 1 : 0] == msg.sender && //TURNI!!!!!
                    (
                        mapPointer["" + msg.coord.x + msg.coord.y] == undefined ||
                        mapPointer["" + msg.coord.x + msg.coord.y] == 2
                    )
                ){
                checkBarca(msg.coord, mapPointer);
                msg.map = games[msg.gamecode].maps[!games[msg.gamecode].turn ? 1 : 0];
                io.to(msg.gamecode).emit("recivemove", msg);
                if(checkValue(mapPointer, 2)){
                    games[msg.gamecode].turn = !games[msg.gamecode].turn;
                    io.to(msg.gamecode).emit("turn", games[msg.gamecode].players[games[msg.gamecode].turn ? 1 : 0]);
                }else{
                    games[msg.gamecode].status = 2;
                    io.to(msg.gamecode).emit("gameEnd", msg.sender);
                }
            }
        }
        //console.log(msg);
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
    checkAf(coord.x, coord.y, map)
}
function checkAf(x, y, mapp){
    newM = [];
    for (i = 0; i<10; i++){
        temp = []
        for (j = 0; j < 10; j++){
            temp.push(0);
        }
        newM.push(temp);
    }
    for (i in mapp) {
        newM[i[0]][i[1]] = mapp[i];
    }
    //console.log(mapp);
    //console.log(newM);

    reso = [];
    puro = {};
    puro.p = true; //per passarlo con reference
    //console.log("Index: %d", indexx);
    //console.log("-------------------------")
    checkAd(x, y, newM, reso, puro);
    if(puro.p){
        //console.log(reso)
        reso.forEach(ee => {
            mapp[ee] = 4;
            //console.log("each: %d", ee)
        });
        
    }
    
}

function checkAd(i, j, m, reso, puro){
    //console.log(m[i]);
    //console.log("i, j: "+ i + j + " v: " + m[i][j])
    if(m[i][j] == 0 || m[i][j] == 1 ||  m[i][j] == 4 ){
        //console.log("finito")
        return;
    }
    if(m[i][j] == 2){
        puro.p = false;
        return;
    }
    if(m[i][j] == 3){
        reso.push("" + i + j);
        //return;
    }
    if(checkCell(i - 1, j) && !reso.includes("" + (i - 1) + j)){
        checkAd(i - 1, j, m, reso, puro);
        //console.log("3 if")
    }
    // - 0 per forzarli a int
    //console.log("check ", "" + i + (j + 1))
    if(checkCell(i, j - 0 + 1) && !reso.includes("" + i + (j - 0 + 1))){
        checkAd(i, j - 0 + 1, m, reso, puro);
        //console.log("4 if")
    }
    if(checkCell(i - 0 + 1, j) && !reso.includes("" + (i - 0 + 1) + j)){
        checkAd(i - 0 + 1, j, m, reso, puro);
        //console.log("prima if")
    }
    if(checkCell(i, j - 1) && !reso.includes("" + i + (j - 1))){
        checkAd(i, j - 1, m, reso, puro);
        //console.log("2 if")
    }
}

function checkCell(x, y){
    if(x >= 0 && x < 10 && y >= 0 && y < 10){
        return true;
    }
    return false;
}

server.listen(process.env.PORT || 3000, () => {
  console.log('listening');
});

setInterval(() => {
    io.emit('chat message', Date.now()); // This will emit the event to all connected clients
    //console.log(games);

}, 3000);

function checkValue(mappp, searchValue) {
    for (i in mappp) {
        if (mappp[i] === searchValue){
            return true;
        }
    }
    return false;
}