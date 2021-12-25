var socket = io();

socket.on('chat message', function(msg) {
    var item = document.getElementById("i").innerHTML = msg;
});

socket.on('recivemove', function(msg) {
    console.log(msg);
    var cell = document.getElementById("enemyboard" + msg.x + msg.y);
    cell.style.backgroundColor = "blue";
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
    socket.emit("startGame", {
        gamecode: document.getElementById("code").value,
        sender: document.getElementById("name").value
    });
    //console.log(document.getElementById("code").value);
}

function move(x, y){
    socket.emit("move", {
        gamecode: document.getElementById("code").value,
        sender: document.getElementById("name").value,
        coord: {x, y}
    });
}