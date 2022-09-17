const crypto = require("crypto");

bots = {}

function createBot(callback) {
    const id = crypto.randomBytes(16).toString("hex");
    let bot = {}
    bot[id] = bots[id]
    
    callback(bot)
}

function handleBot(map, callback) {
    let botId = map.id;
    if (bots[botId]) {
        let aid = undefined;
        for(var id in map.aids) {
            aid = map.aids[id];
        }

        let bot = undefined;
        for(var id in map.players) {
            console.log("bot player is: " + map.players[id])
            bot = JSON.parse(map.players[id])
        }
        
        if (aid) {
            if (!bot) {
                callback({error:"no such bot"})
                return
            }
            let move = subtract(bot.position, aid);
            let mag = magnitude(move);
            move = divide(move, mag);
            
            let message = {
                id: botId,
                message: "move",
                data: move
            }
            callback(message)
        }
        
    } else {
        callback({error:"no such bot"})
    }
}


divide = function (point, scalar) {
    return new Vector(point.x / scalar, point.y / scalar);
};


magnitude = function (point) {
    return Math.sqrt(point.x * point.x + point.y * point.y)
}

subtract = function (point1, point2) {
    return new Vector(point1.x - point2.x, point1.y - point2.y);
}

function clear() {
    bots = {}
}

module.exports = {
    createBot,
    handleBot,
    clear
}