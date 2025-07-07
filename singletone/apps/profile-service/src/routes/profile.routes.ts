// src/routes/profile.routes.ts
import { Router } from 'express';
import { getUserProfile } from '../controllers/profile.controller';

const router = Router();

// Ejemplo: GET /profiles/by-user/:userId
router.get('/by-user/:userId', getUserProfile);

export default router;