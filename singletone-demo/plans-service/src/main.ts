import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PLANS_SERVICE_PORT || 3006;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'plans-service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Gestión de Planes
app.get('/api/plans', (req, res) => {
  res.json({ 
    message: 'Gestión de Planes - Demo Ready',
    plans: [
      {
        id: 'free',
        name: 'Plan Gratuito',
        price: 0,
        currency: 'USD',
        limits: {
          ratingsPerMonth: 10,
          artistsInLibrary: 5
        },
        features: ['Exploración básica', 'Valoraciones limitadas']
      },
      {
        id: 'premium',
        name: 'Plan Premium',
        price: 9.99,
        currency: 'USD',
        limits: {
          ratingsPerMonth: -1, // ilimitado
          artistsInLibrary: -1 // ilimitado
        },
        features: ['Exploración ilimitada', 'Valoraciones ilimitadas', 'Recomendaciones avanzadas']
      }
    ]
  });
});

app.get('/api/plans/:userId/current', (req, res) => {
  const { userId } = req.params;
  res.json({
    userId,
    currentPlan: {
      id: 'free',
      name: 'Plan Gratuito',
      limits: {
        ratingsPerMonth: 10,
        ratingsUsed: 3,
        artistsInLibrary: 5,
        artistsAdded: 2
      },
      status: 'active'
    }
  });
});

app.post('/api/plans/:userId/upgrade', (req, res) => {
  const { userId } = req.params;
  const { planId, paymentMethodId } = req.body;
  
  // Simulación de integración con Stripe
  res.json({
    message: 'Upgrade procesado exitosamente (Demo)',
    userId,
    planId,
    paymentMethodId, // Agregar esta línea
    transaction: {
      id: 'demo_txn_' + Date.now(),
      status: 'completed',
      amount: 9.99,
      currency: 'USD'
    },
    stripeIntegration: 'Demo - Stripe webhook would be processed here'
  });
});

app.get('/api/plans/:userId/usage', (req, res) => {
  const { userId } = req.params;
  res.json({
    userId,
    usage: {
      ratingsThisMonth: 3,
      ratingsLimit: 10,
      artistsInLibrary: 2,
      artistsLimit: 5,
      warningThreshold: 0.8
    },
    notifications: [
      {
        type: 'warning',
        message: 'Has usado 3 de 10 valoraciones este mes'
      }
    ]
  });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Plans Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});