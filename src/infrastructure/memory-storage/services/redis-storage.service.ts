import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { EventEmitter } from 'events';

export const ExpiredEvent = 'key-expired';

@Injectable()
export class RedisStorageService extends EventEmitter {
  private readonly store: Redis;
  private readonly pubsub: Redis;
  constructor(private readonly redisService: RedisService) {
    super();
    this.store = this.redisService.getClient('storage');
    this.pubsub = this.redisService.getClient('sub');
    this.listen();
  }

  private async listen() {
    this.pubsub.config('SET', 'notify-keyspace-events', 'Ex');
    this.pubsub.subscribe('__keyevent@0__:expired');
    this.pubsub.on('message', (event, key) => {
      if (event !== '__keyevent@0__:expired') return;
      this.emit(ExpiredEvent, key);
    });
  }

  async set(key: string, value: any, expiry?: number) {
    const stringified =
      typeof value !== 'object' ? value : JSON.stringify(value);
    !!expiry
      ? await this.store.setex(key, expiry, stringified)
      : await this.store.set(key, stringified);
  }

  async get(key: any): Promise<any> {
    const val = await this.store.get(key);
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }

  async del(key: string): Promise<any> {
    await this.store.del(key);
    return;
  }
}
