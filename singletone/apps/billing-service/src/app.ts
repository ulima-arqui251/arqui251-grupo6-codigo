import express from 'express';
import dotenv from 'dotenv';
import billingRoutes from './routes/billing.routes';
import { verifyJWT } from './middleware/auth.middleware';

console.log('☎️ VERSIÓN BILLING app.ts ejecutándose ACTUAL 4 –', new Date().toISOString());

dotenv.config();

const app = express();
app.use(express.json());

// Protege todo lo que comience con /billing
app.use('/billing', verifyJWT);

app.use('/', billingRoutes);

export default app;