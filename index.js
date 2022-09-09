const {Server} = require("ws");

const connections = {}

const c = []

const spawnPoints = [
    {x : -12, y : -13},
    {x : -12, y : 13},
    {x : 12, y : -13},
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

                jsonData.data = getSpawnPosition();

                getMapFromClient(jsonData.id);
            }

            if (jsonData.message == "respawn") {
                jsonData.data = getSpawnPosition();
            }

            if (jsonData.message === "get_map") {
                getMapFromClient(jsonData.id);
            } else if (jsonData.message === "map") {
                let players = JSON.parse(jsonData.data);
                for (let playerId in players) {
                    players[playerId] = JSON.parse(players[playerId])
                }
                jsonData.data = players;
                if (connections[jsonData.id]) {
                    connections[jsonData.id].send(JSON.stringify(jsonData));
                } else {
                    console.error("attempring to send map to closed connection: " + jsonData.id)
                }
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
            delete connections[socket.id];
            removeElement(c, socket)

        })

        socket.on('close', (data) => {
            console.log("close: " + socket.id);
            delete connections[socket.id];
            removeElement(c, socket)
            let jsonData = {}
            jsonData.id = socket.id
            jsonData.message = "disconnect"
            for(var id in connections) {
                connections[id].send(JSON.stringify(jsonData));
            }
        })
    })
    
    wss.on('listening', () => {
        console.log("Server is now listening");
    })
}

function getSpawnPosition () {
    let randomIndex = Math.floor(Math.random() * spawnPoints.length);
    let spawnPoint = spawnPoints[randomIndex];
    console.log("spawn: " + spawnPoint.x + ", " + spawnPoint.y);
    return spawnPoint;
}

function getMapFromClient(playerId) {

    for(var id in connections) {
        if (id !== playerId) {
            let getMap = {
                id : playerId,
                message : "get_map"
            }
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

module.exports = {
    initWebSocket
}
