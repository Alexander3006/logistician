import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationPayload, NotificationTransport, RABBITMQ } from '../types';

@Injectable()
export class NotificationService {
  private readonly logger: Logger = new Logger(NotificationService.name);
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async notify(
    transport: NotificationTransport,
    payload: NotificationPayload,
    expiration?: number,
  ): Promise<boolean> {
    try {
      await this.amqpConnection.publish(RABBITMQ.EXCHANGE, transport, payload, {
        expiration:
          typeof expiration === 'number' ? expiration * 1000 : undefined,
      });
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
}
