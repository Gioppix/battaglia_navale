var socket = io();

socket.on('chat message', function(msg) {
    var item = document.getElementById("i").innerHTML = msg;
});

grids = document.getElementsByClassName("grid");
[...grids].forEach(item => {
    for(i=0; i<10; i++){
        for(j=0; j<10; j++){
            let div = document.createElement("div");
            div.className = "cella";
            div.dataset.x = j;
            div.dataset.y = i;
            if(item.id == "myboard"){
                div.addEventListener("click", (event) => {click(event)});
            }
            item.append(div);
        }
    }
});

function click(event){
    console.log("" + event.target.dataset.x + " " + event.target.dataset.y)
}

function startGame(){
    socket.emit("startGame", document.getElementById("code").value);
    console.log(document.getElementById("code").value);
}