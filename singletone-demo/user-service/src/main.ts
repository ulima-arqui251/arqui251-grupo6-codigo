import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'user-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Routes básicas
app.get('/api/users', (req, res) => {
  res.json({ 
    message: 'Gestión de Usuarios - Demo Ready',
    endpoints: [
      'POST /api/users/register',
      'POST /api/users/login', 
      'GET /api/users/profile',
      'PUT /api/users/profile'
    ]
  });
});

app.post('/api/users/register', (req, res) => {
  res.json({ 
    message: 'Usuario registrado exitosamente (Demo)',
    userId: 'demo-user-' + Date.now()
  });
});

app.post('/api/users/login', (req, res) => {
  res.json({ 
    message: 'Login exitoso (Demo)',
    token: 'demo-jwt-token-' + Date.now(),
    user: { id: 1, email: 'demo@singletone.com' }
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});