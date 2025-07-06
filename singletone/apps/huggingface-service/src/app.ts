import express from 'express';
import dotenv from 'dotenv';
import huggingfaceRoutes from './routes/huggingface.routes';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/', huggingfaceRoutes);

export default app;