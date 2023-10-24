import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule, RedisService } from 'nestjs-redis';
import { RedisStorageService } from './services/redis-storage.service';
import { LocationStorageService } from './services/location-storage.service';

// @Global()
@Module({
  imports: [ConfigModule, RedisModule],
  providers: [RedisStorageService, LocationStorageService],
  exports: [RedisStorageService, LocationStorageService],
})
export class MemoryStorageModule {
  private readonly logger = new Logger(MemoryStorageModule.name);
  constructor(private readonly redisService: RedisService) {
    // const pub = redisService.getClient('pub');
    // // publish events for keys expiration
    // pub
    //   .send_command('config', ['set', 'notify-keyspace-events', 'KEx'])
    //   .then(() => this.logger.log('Subscribed to expire keys event'));
  }
}
