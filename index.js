const WebSocket = require("ws");

const wss = new WebSocket.Server({port : 3000}, () => {

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
