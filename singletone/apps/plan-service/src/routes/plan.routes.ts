import { Router } from 'express';
import { healthCheck } from '../controllers/plan.controller';

const router = Router();

router.get('/health', healthCheck);

export default router;