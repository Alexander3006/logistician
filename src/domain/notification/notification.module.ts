import { Module, forwardRef } from '@nestjs/common';
import { rabbitmq } from 'src/config/rabbitmq.module';
import { UserModule } from '../user/user.module';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { WebsocketModule } from 'src/infrastructure/websocket/websocket.module';
import { NotificationService } from './services/notification.service';
import { EmailNotificationSubscriber } from './subscribers/email-notification.subscriber';
import { WebsocketNotificationSubscriber } from './subscribers/websocket-notification.subscriber';

@Module({
  imports: [
    rabbitmq,
    forwardRef(() => UserModule),
    MailModule,
    WebsocketModule,
  ],
  providers: [
    NotificationService,
    EmailNotificationSubscriber,
    WebsocketNotificationSubscriber,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
