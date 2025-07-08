import { Router } from 'express';
import { checkHealth } from '../controllers/recommendation.controller';

const router = Router();

router.get('/health', checkHealth);

export default router;