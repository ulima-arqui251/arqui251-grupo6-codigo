import { Router } from 'express';
import { login, verifyToken } from '../controllers/auth.controller';

const router = Router();

router.get('/health', (_, res) => {
    res.status(200).json({ status: 'ok', service: 'auth-service' });
});

router.post('/login', login);
router.post('/verify', verifyToken);

export default router;