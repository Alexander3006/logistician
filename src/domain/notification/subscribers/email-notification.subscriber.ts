import { Injectable, Logger } from '@nestjs/common';
import { MailService } from '../../../infrastructure/mail/services/mail.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  NotificationPayload,
  NotificationTransport,
  RABBITMQ,
} from 'src/domain/notification/types';
import { Templates } from '../../../infrastructure/mail/types';
import { UserQueryService } from 'src/domain/user/services/user-query.service';

@Injectable()
export class EmailNotificationSubscriber {
  private readonly logger: Logger = new Logger(
    EmailNotificationSubscriber.name,
  );
  private readonly supported: string[] = Object.values(Templates);
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: RABBITMQ.EXCHANGE,
    routingKey: [NotificationTransport.MAIL],
    queue: RABBITMQ.EMAIL_NOTIFICATION_QUEUE,
    queueOptions: {
      channel: RABBITMQ.CHANNEL,
    },
  })
  async handleEmailNotification(msg: NotificationPayload): Promise<void> {
    if (!this.supported.includes(msg.event)) {
      this.logger.warn(`Unsupported email notification event: ${msg.event}`);
      return;
    }
    if (!msg.recipients?.length) {
      this.logger.warn(`Email notification must includes recipients`);
      return;
    }
    const promises = msg.recipients.map(async (recipient) => {
      try {
        const user = await this.userQueryService.getUser({ id: recipient });
        if (!user) {
          this.logger.error(
            `Email notification recipient ${recipient} not found`,
          );
          return false;
        }
        return await this.mailService.send({
          locale: msg.locale,
          recipient: user.email,
          template: msg.event as Templates,
          variables: msg.data,
        });
      } catch (err) {
        this.logger.error(err, err?.stack);
        throw err;
      }
    });
    await Promise.allSettled(promises);
  }
}
