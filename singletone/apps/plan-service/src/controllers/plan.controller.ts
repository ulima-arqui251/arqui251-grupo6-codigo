import { Request, Response } from 'express';
import { redis } from '../db/redis';

export const healthCheck = async (req: Request, res: Response) => {
    try {
        await redis.ping();
        res.json({ status: 'ok', redis: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'fail', error: 'Redis connection failed' });
    }
};