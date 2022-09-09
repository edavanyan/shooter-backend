const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const index = require('./index')
const game = require('./game')

app.set("port", port);
const server = app.listen(port, function(error) {
    if (error) {
        console.log("error: ", error);
    } else {
        console.log("listening on port: " + port);
    }
});

app.get('/test', function(req, res) {
    res.send('hello');
    res.end();
});

index.initWebSocket(server, game);