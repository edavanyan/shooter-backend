const WebSocket = require("ws");

function initWebSocket(server) {
    const wss = new WebSocket.Server({ server }, () => {

    });

    wss.on('connection', (socket) => {
        socket.on('message', (data) => {
            console.log(data);
            socket.send(data);
        })
    })

    wss.on('listening', () => {
        console.log("Server is now listening");
    })
}

module.exports = {
    initWebSocket
}
