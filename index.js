const WebSocket = require("ws");

const wss = new WebSocket.Server({port : process.env.PORT || 8080}, () => {

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
