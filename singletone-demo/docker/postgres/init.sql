-- Esquemas
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS plans;

-- Tabla de usuarios
CREATE TABLE users.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Tabla de planes
CREATE TABLE plans.subscription_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    max_ratings_per_month INTEGER,
    max_artists_in_library INTEGER,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de suscripciones de usuarios
CREATE TABLE plans.user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users.users(id),
    plan_id VARCHAR(50) REFERENCES plans.subscription_plans(id),
    status VARCHAR(20) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contadores de uso (también se puede usar Redis)
CREATE TABLE plans.usage_counters (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users.users(id),
    ratings_this_month INTEGER DEFAULT 0,
    artists_in_library INTEGER DEFAULT 0,
    month_year VARCHAR(7), -- formato: 2024-01
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, month_year)
);

-- Insertar planes por defecto
INSERT INTO plans.subscription_plans (id, name, price, max_ratings_per_month, max_artists_in_library, features) VALUES
('free', 'Plan Gratuito', 0.00, 10, 5, '["Exploración básica", "Valoraciones limitadas"]'),
('premium', 'Plan Premium', 9.99, -1, -1, '["Exploración ilimitada", "Valoraciones ilimitadas", "Recomendaciones avanzadas"]');

-- Usuario de prueba
INSERT INTO users.users (email, password_hash, first_name, last_name) VALUES
('demo@singletone.com', '$2b$10$demo.hash.here', 'Usuario', 'Demo');

-- Suscripción de prueba
INSERT INTO plans.user_subscriptions (user_id, plan_id) VALUES
(1, 'free');

-- Contador de uso inicial
INSERT INTO plans.usage_counters (user_id, ratings_this_month, artists_in_library, month_year) VALUES
(1, 3, 2, '2024-12');

-- Índices para optimización
CREATE INDEX idx_users_email ON users.users(email);
CREATE INDEX idx_user_subscriptions_user_id ON plans.user_subscriptions(user_id);
CREATE INDEX idx_usage_counters_user_month ON plans.usage_counters(user_id, month_year);