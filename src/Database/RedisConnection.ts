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
const client = new Redis(redisConfig);
// const client = new Redis({ ...redisConfig, lazyConnect: true });


// Redis Event Listeners
client.on('connect', () => logger.info('🔌 Connected to Redis'));
client.on('ready', () => logger.info('✅ Redis is ready'));
client.on('error', (err) => logger.error('❌ Redis error:', err));
client.on('reconnecting', () => logger.info('♻️ Reconnecting to Redis...'));
client.on('end', () => logger.info('🔴 Redis connection closed'));

// Graceful Shutdown
process.on('SIGINT', async () => {
    await client.quit();
    logger.info('👋 Redis connection closed. Exiting...');
    process.exit(0);
});

export default client;