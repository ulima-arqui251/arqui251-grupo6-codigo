import express from 'express';
import recommendationRoutes from './routes/recommendation.routes';
import { verifyJWT } from './middleware/auth.middleware';

console.log('⏰ VERSIÓN RECCOMENDATION app.ts ejecutándose ACTUAL 5 –', new Date().toISOString());

const app = express();
app.use(express.json());

app.use('/recommendations', verifyJWT);

app.use('/recommendations', recommendationRoutes);

export default app;