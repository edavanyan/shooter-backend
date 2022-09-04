const express = require('express');
const app = express();
const port = process.env.PORT;

app.set("port", port);
app.listen(port, function(error) {
    if (error) {
        console.log("error: ", error);
    } else {
        console.log("listening on port: " + port);
    }
})

app.get('/name', function(req, res) {
    res.send('qaq ker');
    res.end();
});