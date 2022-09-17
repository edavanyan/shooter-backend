const {Server} = require("ws");

const connections = {}

const c = []

const spawnPoints = [
    {x : -12, y : -13},
    {x : -12, y : 0},
    {x : -12, y : 13},
    {x : 12, y : -13},
    {x : 0, y : -13},
    {x : 12, y : 13},
    {x : 0, y : 13},
    {x : 12, y : 0}
]

function initWebSocket(server, game) {
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

                jsonData.data = getSpawnPosition();

                getMapFromClient(jsonData.id);
            }

            if (jsonData.message == "respawn") {
                let id = jsonData.id;
                jsonData.data = {}
                jsonData.data[id] = getSpawnPosition();
            }

            if (jsonData.message == "aid_pick") {
                let removed = game.removeCoin(jsonData.data)
                if (!removed) {
                    return;
                }
            }

            if (jsonData.message === "get_map") {
                getMapFromClient(jsonData.id);

            } else if (jsonData.message === "map") {
                let mapData = JSON.parse(jsonData.data);
                
                let players = JSON.parse(mapData.data);
                let receiverId = mapData.id.toString();
                for(var id in players) {
                    players[id] = JSON.parse(players[id]);
                }
                game.getCoins(function (coins) {
                    jsonData.data = {
                        characters: players,
                        aids: coins
                    }

                    if (connections[receiverId]) {
                        connections[receiverId].send(JSON.stringify(jsonData));
                    } else {
                        console.error("attempting to send map to closed connection: " + jsonData.id)
                    }
                })
            }
            else
            {
                for(var id in connections) {
                    connections[id].send(JSON.stringify(jsonData));
                }
            }
        })

        socket.on('disconnect', (data) => {
            console.log("disconnect: " + socket.id);
            disconnect(socket.id)

        })

        socket.on('close', (data) => {
            console.log("close: " + socket.id);
            disconnect(socket.id)
        })
    })
    
    wss.on('listening', () => {
        console.log("Server is now listening");
    })
}

function disconnect(id) {
    delete connections[socket.id];
    removeElement(c, socket)

    let jsonData = {}
    jsonData.id = socket.id
    jsonData.message = "disconnect"

    for(var id in connections) {
        connections[id].send(JSON.stringify(jsonData));
    }

    if (!isGameActive()) {
        game.clear()
    }    
}

function getSpawnPosition () {
    let randomIndex = Math.floor(Math.random() * spawnPoints.length);
    let spawnPoint = spawnPoints[randomIndex];
    console.log("spawn: " + spawnPoint.x + ", " + spawnPoint.y);
    return spawnPoint;
}

function isGameActive() {
    return Object.keys(connections).length > 0
}

function getMapFromClient(playerId) {

    for(var id in connections) {
        if (id !== playerId) { 
            let getMap = {
                id : playerId,
                message : "get_map"
            }
            console.log("get_map from: " + id)
            connections[id].send(JSON.stringify(getMap))
            break
        }
    }
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

function spawnCoin(coin) {
    jsonData = {}
    jsonData.id = "server"
    jsonData.message = "spawn_aid"
    jsonData.data = coin;
    for(var id in connections) {
        connections[id].send(JSON.stringify(jsonData));
    }
}

module.exports = {
    initWebSocket,
    spawnCoin,
    isGameActive
}
