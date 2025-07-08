import Redis from 'ioredis';

const redisGateway = new Redis({
    host: 'redis-gateway',
    port: 6379
});

export const getUserSubscriptionType = async (userId: number): Promise<'free' | 'premium'> => {
    const value = await redisGateway.get(userId.toString());
    return value === 'premium' ? 'premium' : 'free'; // default to free
};