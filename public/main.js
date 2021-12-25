var socket = io();
var gamecode = undefined;
var playerName = undefined;

socket.on('chat message', function(msg) {
    var item = document.getElementById("i").innerHTML = msg;
});

socket.on('recivemove', function(msg) {
    console.log(msg);
    if(msg.sender == playerName){
        document.getElementById("myboard" + msg.coord.x + msg.coord.y).style.backgroundColor = "blue";
    }else{
        document.getElementById("enemyboard" + msg.coord.x + msg.coord.y).style.backgroundColor = "blue";
    }
    
});

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
                div.addEventListener("click", (event) => {click(event)});
            }
            item.append(div);
        }
    }
});

function click(event){
    //console.log("" + event.target.dataset.x + " " + event.target.dataset.y);
    move(event.target.dataset.x, event.target.dataset.y);
}

function startGame(){
    gamecode = document.getElementById("code").value;
    playerName = document.getElementById("name").value;
    socket.emit("startGame", {
        gamecode: gamecode,
        sender: playerName,
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