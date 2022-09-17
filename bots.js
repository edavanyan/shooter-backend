const crypto = require("crypto");

bots = {}

function createBot(callback) {
    const id = crypto.randomBytes(16).toString("hex");
    let bot = {
        id : id
    }
    bots[id] = bot;
    
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
        let player = undefined;
        for(var id in map.characters) {
            console.log("bot player is: " + map.characters[id].toString())
            if (id === botId) {
                bot = map.characters[id].position
            } else {
                player = map.characters[id].position
            }
        }
        if (!bot) {
            callback({error:"no such bot on map"})
            return
        }
        
        if (player) {
            let direction = subtract(player, bot);
            let mag = magnitude(direction);
            direction = divide(direction, mag);
            
            let message = {
                id: botId,
                message: "fire",
                data: direction                
            }
            callback(message)
        }
        
        let move = {x:0, y:0}
        if (aid) {
            let move = subtract(aid, bot);
            let mag = magnitude(move);
            move = divide(move, mag);   
        }

        let message = {
            id: botId,
            message: "move",
            data: move
        }
        callback(message)
        
    } else {
        callback({error:"no such bot in bots"})
    }
}


divide = function (point, scalar) {
    return {x: point.x / scalar, y: point.y / scalar};
};


magnitude = function (point) {
    return Math.sqrt(point.x * point.x + point.y * point.y)
}

subtract = function (point1, point2) {
    return {x: point1.x - point2.x, y : point1.y - point2.y};
}

function clear() {
    bots = {}
}

module.exports = {
    createBot,
    handleBot,
    clear
}