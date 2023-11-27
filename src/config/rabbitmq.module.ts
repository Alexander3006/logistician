import {
  MessageHandlerErrorBehavior,
  RabbitMQModule as RMQ,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './config.module';

export const rabbitmq = RMQ.forRootAsync(RMQ, {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const host = configService.getOrThrow('RABBITMQ_HOST');
    const port = configService.getOrThrow('RABBITMQ_PORT');
    const user = configService.getOrThrow('RABBITMQ_USER');
    const password = configService.getOrThrow('RABBITMQ_PASSWORD');
    return {
      exchanges: [
        {
          name: 'notification-exchange',
          type: 'topic',
        },
      ],
      channels: {
        notification: {
          prefetchCount: 10,
        },
      },
      uri: `amqp://${user}:${password}@${host}:${port}`,
      defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.REQUEUE,
    };
  },
});
