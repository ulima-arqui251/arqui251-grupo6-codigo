import { Router } from 'express';
import { createCheckoutSession, getPaymentStatus, health } from '../controllers/billing.controller';

const router = Router();

router.get('/health', health);
router.post('/checkout', createCheckoutSession);
router.get('/status/:sessionId', getPaymentStatus);

export default router;