import { Router } from 'express';
import { getUserProfile } from '../controllers/profile.controller';

const router = Router();

router.get('/profiles/:userId', getUserProfile);

export default router;