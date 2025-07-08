import { Router } from 'express';
import { createCheckoutSession, getPaymentStatus, health } from '../controllers/billing.controller';

const router = Router();

router.get('/billing/health', health); // <-- cambia aquí
router.post('/billing/checkout', createCheckoutSession); // <-- aquí también
router.get('/billing/status/:sessionId', getPaymentStatus); // <-- y aquí

export default router;