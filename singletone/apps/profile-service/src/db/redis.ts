import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
});

redis.on('connect', () => {
    console.log('✅ Redis connected - profile-service');
});

redis.on('error', (err) => {
    console.error('❌ Redis error - profile-service:', err);
});

export default redis;