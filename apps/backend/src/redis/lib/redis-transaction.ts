import { ChainableCommander } from 'ioredis';

export class RedisTransaction {
  constructor(
    private readonly tx: ChainableCommander,
  ) {}

  set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): this {
    if (ttlSeconds) {
      this.tx.set(key, value, 'EX', ttlSeconds);
    } else {
      this.tx.set(key, value);
    }

    return this;
  }

  sAdd(
    key: string,
    ...members: string[]
  ): this {
    this.tx.sadd(key, ...members);
    return this;
  }

  sRem(
    key: string,
    ...members: string[]
  ): this {
    this.tx.srem(key, ...members);
    return this;
  }

  delete(
    key: string,
  ): this {
    this.tx.del(key);
    return this;
  }

  async exec(): Promise<void> {
    const result = await this.tx.exec();

    if (!result) {
      throw new Error('Redis transaction aborted');
    }

    for (const [error] of result) {
      if (error) {
        throw error;
      }
    }
  }
}
