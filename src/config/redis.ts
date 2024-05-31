import * as redis from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:8080';
const redisClient = redis.createClient({ url: redisUrl });

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('ready', () => {
  console.log('Redis is ready');
});

redisClient.connect();

export default redisClient;