const client = require('./client');

class ProbabilisticCache {
    // Beta 5 works well with TTL 20
    _BETA = 5;
    _TTL = 20;
    _TTL_MILISECONDS = null;

    _client = null;

    constructor() {
        this._client = client();
        this._TTL_MILISECONDS = this._TTL * 1000;
    }

    async get(key) {
        const cacheData = JSON.parse(await this._client.get(key));
        const cacheTTL = await this._client.ttl(key);

        console.log("Cache ttl: " + cacheTTL);
        
        if (cacheData == null || Date.now() - cacheData.delta * this._BETA * Math.log(Math.random()) >= cacheData.expiry) {
            const startTime = Date.now();
            await new Promise(r => setTimeout(r, 200));
            const value = Math.floor(Math.random() * 100);
            const delta = Date.now() - startTime;
            await this.set(key, value, delta);

            return value;
        }
        return cacheData.value;
    }

    async set(key, value, delta = 20) {
        await this._client.set(key, JSON.stringify({value, delta, expiry: Date.now() + this._TTL_MILISECONDS}), 'EX', this._TTL);
    }
};

module.exports = ProbabilisticCache;