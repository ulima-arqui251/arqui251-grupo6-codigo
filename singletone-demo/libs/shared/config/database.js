// libs/shared/config/database.js

const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const redis = require('redis');

// PostgreSQL Connection
const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'singletone_db',
    process.env.POSTGRES_USER || 'admin',
    process.env.POSTGRES_PASSWORD || 'password',
    {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: process.env.POSTGRES_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

// MongoDB Connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/singletone_music',
        { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

// Redis Connection
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
});

module.exports = {
    sequelize,
    connectMongoDB,
    redisClient
};