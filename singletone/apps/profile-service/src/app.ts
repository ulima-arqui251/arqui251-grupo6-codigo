// src/app.ts
import express from 'express';
import profileRoutes from './routes/profile.routes';
import { verifyJWT } from './middleware/auth.middleware';

const app = express();
app.use(express.json());

// Protección para todas las rutas bajo /profiles
app.use('/profiles', verifyJWT);

// Rutas montadas con prefijo claro
app.use('/profiles', profileRoutes);

export default app;