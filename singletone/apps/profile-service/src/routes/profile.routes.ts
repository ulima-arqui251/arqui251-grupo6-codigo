import { Router } from 'express';
import { getUserProfile } from '../controllers/profile.controller';

const router = Router();

router.get('/profile/:userId', getUserProfile);

export default router;