import express from 'express';
import libraryRoutes from './routes/library.routes';

const app = express();

app.use(express.json());
app.use('/', libraryRoutes);

export default app;