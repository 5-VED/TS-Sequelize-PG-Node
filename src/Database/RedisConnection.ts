import Redis from 'ioredis';
import dotenv from 'dotenv';
import logger from '../Config/Logger';

dotenv.config();

// Define Redis configuration interface
interface RedisConfig {
    host: string;
    port: number;
    password?: string | null;
    db: number;
    tls?: object | null;
    retryStrategy?: (times: number) => number;
}

// Load configuration dynamically from environment variables
const redisConfig = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || null,
    db: Number(process.env.REDIS_DB) || 0,
    tls: process.env.REDIS_TLS === 'true' ? {} : null, // Enable TLS if needed
    retryStrategy: (times: number) => Math.min(times * 50, 2000), // Exponential retry
} as any;

// Create Redis client
const redisClient = new Redis(redisConfig);

// Redis Event Listeners
redisClient.on('connect', () => logger.info('🔌 Connected to Redis'));
redisClient.on('ready', () => logger.info('✅ Redis is ready'));
redisClient.on('error', (err) => logger.error('❌ Redis error:', err));
redisClient.on('reconnecting', () => logger.info('♻️ Reconnecting to Redis...'));
redisClient.on('end', () => logger.info('🔴 Redis connection closed'));

// Graceful Shutdown
process.on('SIGINT', async () => {
    await redisClient.quit();
    logger.info('👋 Redis connection closed. Exiting...');
    process.exit(0);
});

export default redisClient;