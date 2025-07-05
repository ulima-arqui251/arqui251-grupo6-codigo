// plan.routes.ts
import { Router } from 'express';
import { healthCheck } from '../controllers/plan.controller';

const router = Router();

// ✅ RUTA CORRECTA
router.get('/plans/health', healthCheck);

export default router;