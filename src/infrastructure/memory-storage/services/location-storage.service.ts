import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class LocationStorageService extends EventEmitter {
  private readonly store: Redis;
  constructor(private readonly redisService: RedisService) {
    super();
    this.store = this.redisService.getClient('location-storage');
  }

  async saveGeo(
    context: string,
    id: string,
    longitude: number,
    latitude: number,
  ): Promise<void> {
    // @ts-ignore
    await this.store.geoadd(context, [longitude, latitude, id]);
    this.emit(`${context}-location-update`, { id, longitude, latitude });
    return;
  }

  async deleteGeo(context: string, id: string): Promise<void> {
    await this.store.zrem(context, id);
    this.emit(`${context}-location-remove`, { id });
  }

  async findNearby(
    context: string,
    longitude: number,
    latitude: number,
    radius: number,
  ): Promise<
    {
      id: string;
      distance: string;
    }[]
  > {
    const result: {
      id: string;
      distance: string;
    }[] = await this.store
      .georadius(
        context,
        longitude,
        latitude,
        radius,
        'm',
        'WITHCOORD',
        'WITHDIST',
      )
      .then((res) => res.map(([id, distance]) => ({ id, distance })));
    return result;
  }
}
