import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
});

redis.on('connect', () => console.log('Connected to Redis (library)'));
redis.on('error', (err) => console.error('Redis error:', err));