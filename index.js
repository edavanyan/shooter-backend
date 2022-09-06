const {Server} = require("ws");

function initWebSocket(server) {
    const wss = new Server({ server }, () => {
        console.log("start web server")
    });
    
    console.log("init web socket: " + server);

    wss.on('connection', (socket) => {
        socket.on('message', (data) => {
            let json = JSON.parse(data.toString())
            console.log(json);
            socket.send(json.sender);
        })
    })

    wss.on('listening', () => {
        console.log("Server is now listening");
    })
}

module.exports = {
    initWebSocket
}
