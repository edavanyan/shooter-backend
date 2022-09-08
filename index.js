const {Server} = require("ws");

const connections = {}

const spawnPoints = [
    {x : -12, y : -13},
    {x : -12, y : 13},
    {x : -12, y : 13},
    {x : 12, y : 13}
]

function initWebSocket(server) {
    const wss = new Server({ server }, () => {
        console.log("start web server")
    });
    
    console.log("init web socket: " + server);

    wss.on('connection', (socket) => {
        socket.on('message', (data) => {

            let jsonData = JSON.parse(data.toString());

            if (jsonData.message === "join") {
                socket.id = jsonData.id;
                connections[jsonData.id] = socket;

                let randomIndex = Math.floor(Math.random() * spawnPoints.length);
                socket.position = spawnPoints[randomIndex];
                jsonData.data = socket.position;

                let sockets = {}
                for(var id in connections) {
                    if (id !== socket.id) {
                        sockets[id] = connections[id].position;
                    }
                }
                let map = {
                    id : socket.id,
                    message : "map",
                    data : sockets
                }
                
                socket.send(JSON.stringify(map));
            }
            
            if (jsonData.message === "move") {
                socket.position.x += jsonData.data.x;
                socket.position.y += jsonData.data.y;
            }


            for(var id in connections) {
                connections[id].send(JSON.stringify(jsonData));
            }
        })

        socket.on('disconnect', (data) => {
            delete connections[socket.id];
        })

        socket.on('close', (data) => {
            delete connections[socket.id];
        })
    })
    
    wss.on('listening', () => {
        console.log("Server is now listening");
    })
}

function removeElement(arr, element) {

    for( var i = 0; i < arr.length; i++) { 
    
        if ( arr[i] === element) { 
    
            arr.splice(i, 1); 
        }
    
    }
    return arr;
}

module.exports = {
    initWebSocket
}
