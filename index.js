const {Server} = require("ws");

const connections = []

function initWebSocket(server) {
    const wss = new Server({ server }, () => {
        console.log("start web server")
    });
    
    console.log("init web socket: " + server);

    wss.on('connection', (socket) => {
        connections.push(socket)

        socket.on('message', (data) => {
            let jsonData = JSON.parse(data.toString());
            for( var i = 0; i < connections.length; i++) { 
                connections[i].send(data.toString());
            }
        })

        socket.on('disconnect', (data) => {
            connections = removeElement(connections, socket);
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
