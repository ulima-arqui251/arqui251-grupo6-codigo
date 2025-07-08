import express from 'express';
import libraryRoutes from './routes/library.routes';
import { verifyJWT } from './middleware/auth.middleware';

const app = express();

app.use(express.json());

// Protege todas las rutas bajo /library
app.use('/library', verifyJWT);

app.use('/', libraryRoutes);

export default app;