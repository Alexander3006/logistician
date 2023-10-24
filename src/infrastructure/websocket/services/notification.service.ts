import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { ConnectionsState } from './connection-state.service';

const EMIT_WEBSOCKET_EVENT = 'EMIT_WEBSOCKET_EVENT';

export class WebsocketNotificationServiceError extends Error {}

@Injectable()
export class WebsocketNotificationService {
  private readonly logger: Logger;
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  constructor(
    private readonly redisService: RedisService,
    private readonly connectionState: ConnectionsState,
  ) {
    this.logger = new Logger(WebsocketNotificationService.name);
    this.publisher = redisService.getClient('pub');
    this.subscriber = redisService.getClient('sub');
    this.listen();
    //test
    // setInterval(() => {
    //   this.notify('super_event', {a: 1, b: 's', c: null});
    // }, 5000)
  }

  private listen() {
    this.subscriber.subscribe(EMIT_WEBSOCKET_EVENT);
    this.subscriber.on('message', async (channel, payload) => {
      if (channel !== EMIT_WEBSOCKET_EVENT) return;
      const { event, body, userIds } = JSON.parse(payload);
      await this.connectionState.sendMessage(event, body, userIds);
    });
  }

  async notify(event: string, payload: any, userIds?: string[]) {
    const message = JSON.stringify({
      event,
      body: payload,
      userIds: userIds,
    });
    await this.publisher.publish(EMIT_WEBSOCKET_EVENT, message);
  }
}
