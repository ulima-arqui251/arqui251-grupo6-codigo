import express from 'express';
import dotenv from 'dotenv';
import billingRoutes from './routes/billing.routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/', billingRoutes);

export default app;