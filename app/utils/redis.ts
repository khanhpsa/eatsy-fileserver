import redis from 'redis';
import { logger } from '../logger';

// Create a Redis client
const client = redis.createClient({
  password: 'm1YnbbptFkNb73asExIP2od0TPQiX9p3',
  socket: {
    host: 'redis-11727.c299.asia-northeast1-1.gce.cloud.redislabs.com',
    port: 11727,
  },
});

client.on('error', (err) => logger.info(`Redis Client Error: ${err}`));
await client.connect();

// Set key-value pair in Redis
const setKeyValue = async (key: string, value: any) => {
  try {
    await client.set(key, value);
  } catch (error) {
    logger.info(`Error setting key from Redis: ${error}`);
  }
};

// Get value for a given key from Redis
const getValue = async (key: string) => {
  try {
    const value = await client.get(key);
    return value;
  } catch (error) {
    logger.info(`Error getting key from Redis: ${error}`);
    throw error;
  }
};

// Delete a key from Redis
const deleteKey = async (key: string) => {
  try {
    await client.del(key);
  } catch (error) {
    logger.info(`Error deleting key from Redis: ${error}`);
  }
};

export default {
  setKeyValue,
  getValue,
  deleteKey,
};
