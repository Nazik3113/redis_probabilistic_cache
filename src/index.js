const buildRedisClient = require('./client');
const crypto = require('crypto');
const express = require('express');
const ProbabilisticCache = require('./probabilistic_cache');

const app = express();
const port = 8083;

const redis = buildRedisClient();

const probabilistic_cache_client = new ProbabilisticCache();

app.get('/', async (req, res) => {
    await redis.set(generateRandomString(25), generateRandomString(25), "EX", 200);
    res.json({ status: 1 });
});

app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
});

function generateRandomString(length) {
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').slice(0, length);
};

async function start() {
    while (true) {
        const res = await probabilistic_cache_client.get("random");
        console.log("Cache data: " + res);
        await new Promise(r => setTimeout(r, 200));
    }
}

start();