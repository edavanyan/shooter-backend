const {Server} = require("ws");

const connections = {}

const c = []

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
            c.push(socket)

            let jsonData = JSON.parse(data.toString());

            if (jsonData.message === "join_bot") {
                createBot(jsonData.id);
            }

            if (jsonData.message === "join") {
                socket.id = jsonData.id;
                connections[jsonData.id] = socket;

                let randomIndex = Math.floor(Math.random() * spawnPoints.length);
                socket.position = spawnPoints[randomIndex];
                jsonData.data = socket.position;

                for(var id in connections) {
                    let getMap = {
                        id : id,
                        message : "get_map"
                    }
                    connections[id].send(JSON.stringify(getMap))
                    break
                }
            }
            
            if (jsonData.message === "move") {
                socket.position.x += jsonData.data.x;
                socket.position.y += jsonData.data.y;
            }

            if (jsonData.message === "map") {
                let players = JSON.parse(jsonData.data);
                for (let playerId in players) {
                    console.log("id: " + playerId);
                    players[playerId] = JSON.parse(players[playerId])
                }
                jsonData.data = players;
                console.log(jsonData.data);
                connections[jsonData.id].send(JSON.stringify(jsonData));
            }
            else
            {
                for(var id in connections) {
                    connections[id].send(JSON.stringify(jsonData));
                }
            }
        })

        socket.on('disconnect', (data) => {
            delete connections[socket.id];
            removeElement(c, socket)
        })

        socket.on('close', (data) => {
            delete connections[socket.id];
            removeElement(c, socket)
        })
    })
    
    wss.on('listening', () => {
        console.log("Server is now listening");
    })
}

function createBot(id) {
    let jsonData = {};
    jsonData.id = id
    jsonData.message = "join";
    let randomIndex = Math.floor(Math.random() * spawnPoints.length);
    jsonData.data = spawnPoints[randomIndex];
    
    for( var i = 0; i < c.length; i++) {
        c[i].send(JSON.stringify(jsonData));
    }
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
