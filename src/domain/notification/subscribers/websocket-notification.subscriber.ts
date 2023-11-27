import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { WebsocketNotificationService } from 'src/infrastructure/websocket/services/notification.service';
import { NotificationPayload, NotificationTransport, RABBITMQ } from '../types';

@Injectable()
export class WebsocketNotificationSubscriber {
  private readonly logger: Logger = new Logger(
    WebsocketNotificationSubscriber.name,
  );
  constructor(
    private readonly websocketNotificationService: WebsocketNotificationService,
  ) {}

  @RabbitSubscribe({
    exchange: RABBITMQ.EXCHANGE,
    routingKey: [NotificationTransport.WEBSOCKET],
    queue: RABBITMQ.WEBSOCKET_NOTIFICATION_QUEUE,
    queueOptions: {
      channel: RABBITMQ.CHANNEL,
    },
  })
  async handleWebsocketNotification(msg: NotificationPayload): Promise<void> {
    await this.websocketNotificationService.notify(
      msg.event,
      msg.data,
      msg.recipients,
    );
    return;
  }
}
