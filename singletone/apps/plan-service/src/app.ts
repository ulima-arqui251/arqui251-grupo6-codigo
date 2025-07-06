import express from 'express';
import planRoutes from './routes/plan.routes';

const app = express();
app.use(express.json());
app.use('/', planRoutes);

export default app;