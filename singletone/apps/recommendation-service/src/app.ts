import express from 'express';
import recommendationRoutes from './routes/recommendation.routes'; // ✅

const app = express();

app.use(express.json());
app.use('/api', recommendationRoutes);

export default app;