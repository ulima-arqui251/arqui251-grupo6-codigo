import { Router } from 'express';
import { health, generateText } from '../controllers/huggingface.controller';

const router = Router();

router.get('/huggingface/health', health); // <-- cambia aquí
router.post('/huggingface/generate', generateText); // <-- también aquí

export default router;