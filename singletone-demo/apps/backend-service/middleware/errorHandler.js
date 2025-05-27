const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Error por defecto
  let error = {
    status: 'error',
    message: 'Internal Server Error',
    statusCode: 500
  };

  // Errores de validación
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.statusCode = 400;
    error.details = Object.values(err.errors).map(val => val.message);
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Errores de MongoDB
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    error.message = 'Database Error';
    error.statusCode = 500;
  }

  // Error de conexión de MongoDB
  if (err.code === 11000) {
    error.message = 'Duplicate field value';
    error.statusCode = 400;
  }

  // Errores de PostgreSQL
  if (err.code && err.code.startsWith('23')) {
    error.message = 'Database constraint violation';
    error.statusCode = 400;
  }

  // Errores personalizados
  if (err.statusCode) {
    error.statusCode = err.statusCode;
    error.message = err.message;
  }

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(error.statusCode).json({
    ...error,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  });
};

module.exports = errorHandler;