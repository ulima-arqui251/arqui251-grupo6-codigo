const jwt = require('jsonwebtoken');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'singletone-demo-secret-key';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verificar JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Opcional: Validar con el user-service
    try {
      const userResponse = await axios.get(`${USER_SERVICE_URL}/api/users/${decoded.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      });
      
      req.user = {
        ...decoded,
        ...userResponse.data
      };
    } catch (serviceError) {
      // Si el servicio no responde, usar solo los datos del JWT
      console.warn('User service unavailable, using JWT data only');
      req.user = decoded;
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is malformed or expired'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
};

// Middleware opcional para rutas que pueden funcionar con o sin autenticación
const optionalAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
};

module.exports = {
  authMiddleware,
  optionalAuth
};