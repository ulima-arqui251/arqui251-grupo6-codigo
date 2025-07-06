import { Router } from 'express';
import { health, generateText } from '../controllers/huggingface.controller';

const router = Router();

router.get('/health', health);
router.post('/generate', generateText);

export default router;