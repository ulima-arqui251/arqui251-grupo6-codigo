import express from 'express';
import musicRoutes from './routes/music.routes';

const app = express();
app.use(express.json());
app.use('/', musicRoutes);

export default app;