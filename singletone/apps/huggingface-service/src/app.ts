import express from 'express';
import dotenv from 'dotenv';
import huggingfaceRoutes from './routes/huggingface.routes';
import { verifyJWT } from './middleware/auth.middleware';

dotenv.config();

const app = express();
app.use(express.json());

// Protege todo lo que sea /huggingface/*
app.use('/huggingface', verifyJWT);

app.use('/', huggingfaceRoutes);

export default app;