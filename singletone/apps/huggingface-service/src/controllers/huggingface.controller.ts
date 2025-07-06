import { Request, Response } from 'express';

// GET /huggingface/health
export function health(req: Request, res: Response) {
    return res.status(200).json({ status: 'ok', service: 'huggingface-service' });
}

// POST /huggingface/generate
export function generateText(req: Request, res: Response) {
    const { prompt } = req.body;

    return res.json({
        mock: true,
        prompt,
        generated: `Este es un texto simulado para el prompt: "${prompt}"`,
    });
}