// libs/shared/config/database.js
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const redis = require('redis');

// PostgreSQL Connection (puerto 5433)
const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'singletone_db',
    process.env.POSTGRES_USER || 'admin',
    process.env.POSTGRES_PASSWORD || 'password',
    {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5433, // Puerto actualizado
        dialect: 'postgres',
        logging: false,
        pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
        }
    }
);

// MongoDB Connection (puerto 27018)
const connectMongoDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27018/singletone_music?authSource=admin';
        await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
};

// Redis Connection (puerto 6380)
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6380, // Puerto actualizado
    password: process.env.REDIS_PASSWORD || undefined,
    retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('Redis server refuses connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Redis retry time exhausted');
        }
        if (options.attempt > 10) {
        return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
});

redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));

module.exports = {
    sequelize,
    connectMongoDB,
    redisClient
};