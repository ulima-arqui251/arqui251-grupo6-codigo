import express from 'express';
import userRoutes from './routes/user.routes';
import { verifyJWT } from './middleware/auth.middleware'; // ✅ Activado nuevamente
console.log('🟨 Versión app.ts ejecutándose –', new Date().toISOString());

const app = express();
app.use(express.json());

// 🔍 Log de todas las peticiones entrantes
app.use((req, res, next) => {
    console.log(`📡 Acceso entrante: ${req.method} ${req.originalUrl}`);
    next();
});

// 🔐 Protección con JWT para todas las rutas excepto las públicas
app.use('/users', (req, res, next) => {
    const openRoutes = [
        { method: 'POST', path: '/users' },
        { method: 'POST', path: '/users/credentials' },
        { method: 'GET', path: '/users/full' }
    ];

    const isPublic = openRoutes.some(
        route =>
            route.method === req.method &&
            req.originalUrl === route.path
    );

    console.log(`🔐 Evaluando: ${req.method} ${req.originalUrl} → Pública: ${isPublic}`);

    if (isPublic) return next();
    return verifyJWT(req, res, next);
});

// ✅ Rutas de usuario
app.use('/users', userRoutes);

export default app;