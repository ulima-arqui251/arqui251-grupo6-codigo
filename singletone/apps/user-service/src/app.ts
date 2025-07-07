import express from 'express';
import userRoutes from './routes/user.routes';
import { verifyJWT } from './middleware/auth.middleware';

console.log('☢️ VERSIÓN app.ts ejecutándose ACTUAL 4 –', new Date().toISOString());

const app = express();
app.use(express.json());

// 🔍 Log de todas las peticiones entrantes
app.use((req, res, next) => {
    console.log(`📡 Acceso entrante: ${req.method} ${req.originalUrl}`);
    next();
});

// 🔐 Middleware de autenticación para rutas protegidas
app.use('/users', (req, res, next) => {
    const publicRoutes = [
        { method: 'POST', path: '/users/register' },
        { method: 'POST', path: '/users/credentials' },
    ];

    const cleanPath = `/users${req.path.replace(/\/+$/, '') || '/'}`;
    const isPublic = publicRoutes.some(
        route => route.method === req.method && route.path === cleanPath
    );

    console.log(`🔐 Evaluando: ${req.method} ${cleanPath} → Pública: ${isPublic}`);
    if (isPublic) return next();

    return verifyJWT(req, res, next);
});

// ✅ Montamos las rutas bajo /users
app.use('/users', userRoutes);

export default app;