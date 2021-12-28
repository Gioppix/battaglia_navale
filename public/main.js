var socket = io();
var gamecode = undefined;
var playerName = undefined;
var map = new Map();
var gameStarted = false;

socket.on('chat message', function(msg) {
    var item = document.getElementById("i").innerHTML = msg;
});
socket.on('gameEnd', function(msg) {
    let a = document.createElement("div");
    a.className = "gameover";
    if(msg == playerName){
        a.innerHTML = "Gioco finito. Hai vinto";
    }else{
        a.innerHTML = "Gioco finito. Hai perso";
    }
    document.body.append(a);
});
socket.on('turn', function(msg) {
    if(msg == playerName){
        document.getElementById("mytitle").style.backgroundColor = "rgb(0, 128, 0)";
        document.getElementById("enemytitle").style.backgroundColor = "transparent";
    }else{
        document.getElementById("mytitle").style.backgroundColor = "transparent";
        document.getElementById("enemytitle").style.backgroundColor = "rgb(128, 0, 0)";
    }
});

socket.on('recivemove', function(msg) {
    console.log(msg);
    if(msg.sender == playerName){ //io ho mandato la mossa, va al mio nemico
        //document.getElementById("myboard" + msg.coord.x + msg.coord.y).style.backgroundColor = "blue";
        updategrid("enemyboard", msg.map, false);
    }else{
        //document.getElementById("enemyboard" + msg.coord.x + msg.coord.y).style.backgroundColor = "blue";
        updategrid("myboard", msg.map, true);
    }
    
});

function updategrid(id, map, show){
    for (var key in map) {
        var value = map[key];
        console.log(key, value);
        color = "";
        switch(value){
            case 1:
                color = "blue";
                break;
            case 2:
                if(show){
                    color = "green";
                }
                break;
            case 3:
                color = "brown";
                break;
            case 4:
                color = "red";
                break;
        }
        document.getElementById(id + key).style.backgroundColor = color;
     }
}

grids = document.getElementsByClassName("grid");
[...grids].forEach(item => {
    for(i=0; i<10; i++){
        for(j=0; j<10; j++){
            let div = document.createElement("div");
            div.className = "cella";
            div.dataset.x = j;
            div.dataset.y = i;
            div.id = "" + item.id + j + i;
            if(item.id == "myboard"){
                div.addEventListener("click", (event) => {addBoat(event)});
            }else{
                div.addEventListener("click", (event) => {click(event)});
            }
            item.append(div);
        }
    }
});

function click(event){
    if(gameStarted){
        move(event.target.dataset.x, event.target.dataset.y);
    }  
}

function addBoat(event){
    if(!gameStarted){
        map["" + event.target.dataset.x + event.target.dataset.y] = 2;
        document.getElementById("myboard" + event.target.dataset.x + event.target.dataset.y).style.backgroundColor = "green";
    } 
}

function startGame(){
    gameStarted = true;
    document.getElementById("boton").disabled = true;
    
    gamecode = document.getElementById("code").value;
    playerName = document.getElementById("name").value;
    socket.emit("startGame", {
        gamecode: gamecode,
        sender: playerName,
        map: map,
    });
    //console.log(document.getElementById("code").value);
}

function move(x, y){
    socket.emit("move", {
        gamecode: gamecode,
        sender: playerName,
        coord: {x, y}
    });
}