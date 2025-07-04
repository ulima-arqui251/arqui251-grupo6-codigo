import express from 'express';
import profileRoutes from './routes/profile.routes';

const app = express();
app.use(express.json());
app.use('/api', profileRoutes);

export default app;