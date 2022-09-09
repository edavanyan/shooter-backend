const index = require("./index");
const crypto = require("crypto");

const delta = 0.2

setInterval(update, 200)

const _minX = -12, _maxX = 13;
const _minY = -12, _maxY = 13;

const coins = {}

const COIN_SPAWN_INTERVAT = 10
coinTimer = 0;

function update() {
    if (index.isGameActive()) {
        spawnCoin();
    }
}

function spawnCoin() {
    coinTimer += delta;

    if (coinTimer >= COIN_SPAWN_INTERVAT) {
        coinTimer = 0;
        let x = _minX + Math.floor(Math.random() * _maxX);
        let y = _minY + Math.floor(Math.random() * _maxY);

        const id = crypto.randomBytes(16).toString("hex");
        coin = {}
        coin [id] = {x:x, y:y}
        coins[id] = coin;
        index.spawnCoin(coin)
    }
}

function removeCoin(id) {
    console.log("coins before remove: " + Object.keys(coins).length);
    if (coins[id]) {
        delete coins[id];
        console.log("coins after: " + Object.keys(coins).length);
        return true
    }
    console.log("coins after: " + Object.keys(coins).length);

    return false;
}

module.exports = {
    removeCoin
}