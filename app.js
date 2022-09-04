const http = require('http');
const port = 3000;
const express = require('express');
const app = express();

app.set("port", port);
app.listen(port, function(error) {
    if (error) {
        console.log("error: ", error);
    } else {
        console.log("listening on port: " + port);
    }
})

app.get('/name', function(req, res) {
    res.send('edgar');
    res.end();
});