// src/app.ts
import express from 'express';
import musicRoutes from './routes/music.routes';
import { verifyJWT } from './middleware/auth.middleware';

const app = express();
app.use(express.json());

app.use('/music', verifyJWT); // ✅ proteger todas las rutas bajo /music
app.use('/', musicRoutes); // ✅ rutas bien montadas

export default app;