import { Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ICacheService } from '../interface';
import { tryCatch } from 'src/utils/try-catch';

export class RedisClient implements ICacheService {
  private static instance: RedisClient;

  redisClient: RedisClientType;
  private defaultTTL?: number;

  private constructor(url: string, defaultTTL?: number) {
    this.redisClient = createClient({ url });
    this.defaultTTL = defaultTTL;
  }

  public static async init(url: string, defaultTTL?: number) {
    if (!this.instance) {
      this.instance = new RedisClient(url, defaultTTL);
      await this.instance._connect();
      console.log('Connected to Redis');
    }
  }

  public static getInstance(): RedisClient {
    if (!this.instance) {
      throw new Error('RedisClient instance not initialized');
    }

    return this.instance;
  }

  private async _connect(): Promise<void> {
    try {
      await this.redisClient.connect();
      Logger.log('Connected to redis server');
    } catch (error) {
      Logger.error((error as Error).message);
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  public async set(
    key: string,
    value: string,
    ttlInSeconds?: number,
  ): Promise<void> {
    const ttl = ttlInSeconds ?? this.defaultTTL;
    if (ttl) {
      await this.redisClient.set(key, value, { EX: ttl });
    } else {
      await this.redisClient.set(key, value);
    }
  }

  public async getObject<T>(key: string): Promise<T | null> {
    const { data: raw, error } = await tryCatch(this.get(key));

    if (error) {
      Logger.error(`getObject | ${key}: ${error}`);
    }

    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public async setObject(
    key: string,
    value: object,
    ttlInSeconds?: number,
  ): Promise<void> {
    const stringified = JSON.stringify(value);
    await this.set(key, stringified, ttlInSeconds);
  }

  public async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      Logger.error(`delete | ${key}: ${(error as Error).message}`);
    }
  }

  public async disconnect(): Promise<void> {
    await this.redisClient.disconnect();
    Logger.log('Disconnected redis server');
  }
}
