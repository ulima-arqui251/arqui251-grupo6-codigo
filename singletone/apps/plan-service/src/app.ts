// src/app.ts
import express from 'express';
import planRoutes from './routes/plan.routes';
import { verifyJWT } from './middleware/auth.middleware';

const app = express();
app.use(express.json());

// Protección para todas las rutas bajo /plans
app.use('/plans', verifyJWT);

// Rutas montadas con prefijo claro
app.use('/plans', planRoutes);

export default app;