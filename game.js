const index = require("./index");
const crypto = require("crypto");

const delta = 0.2

setInterval(update, 200)

const _minX = -12, _maxX = 13;
const _minY = -12, _maxY = 13;

coins = {}

const COIN_SPAWN_INTERVAT = 10
coinTimer = 0;

const Max_Coins = 10

function update() {
    if (index.isGameActive()) {
        spawnCoin();
    }
}

function spawnCoin() {
    coinTimer += delta;

    if (coinTimer >= COIN_SPAWN_INTERVAT) {
        coinTimer = 0;
        if (Object.keys(coins).length < Max_Coins) {
            let x = _minX + Math.floor(Math.random() * (_maxX - _minX));
            let y = _minY + Math.floor(Math.random() * (_maxY - _minY));

            const id = crypto.randomBytes(16).toString("hex");
            coins[id] = {x:x, y:y};
            let coin = {}
            coin[id] = coins[id]
            index.spawnCoin(coin)
        }
    }
}

function removeCoin(id) {
    if (coins[id]) {
        delete coins[id];
        return true
    }

    return false;
}

function clear() {
    coins = {}
}

module.exports = {
    removeCoin,
    coins,
    clear
}