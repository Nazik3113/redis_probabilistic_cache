const Redis = require('ioredis');

const NODES = "173.20.0.3:6373,173.20.0.4:6373,173.20.0.5:6373,173.20.0.6:6373,173.20.0.7:6373,173.20.0.8:6373";

/**
 * Get an existing Redis client instance. Build one if necessary
 * @return {Cluster|null} redis client
 * */
function buildRedisClient() {
    try {
        const nodes = NODES.split(',').map(url => {
            const [host, port] = url.split(':')
            return { host, port }
        })

        const client = new Redis.Cluster(nodes, {
            redisOptions: {
                enableAutoPipelining: true,
            }
        })

        client.on('error', error => {
            console.error('Redis Error', error)
        })

        client.on('connect', () => {
            console.log('Redis Connection stablished')
        })

        client.on('ready', () => {
            console.log('Redis client ready')
        })

        client.on('end', () => {
            console.log('Redis client connection ended')
        })

        // Emits when an error occurs when connecting 
        // to a node when using Redis in Cluster mode
        client.on('node error', (error, node) => {
            console.error(`Redis error in node ${node}`, error)
        })

        return client
    } catch (error) {
        console.error('Could not create a Redis cluster client', error)

        return null
    }
}
  
module.exports = buildRedisClient