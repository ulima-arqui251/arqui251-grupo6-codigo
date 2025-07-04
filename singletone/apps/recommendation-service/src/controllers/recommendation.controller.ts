import { Request, Response } from 'express';

export const checkHealth = (_req: Request, res: Response) => {
    res.json({ status: 'Recommendation Service is running' });
};