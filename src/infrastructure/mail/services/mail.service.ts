import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailDTO } from '../dto/send-mail.dto';
import { MailgunService } from '@nextnm/nestjs-mailgun';
import { MailerSubject, MailerTextRenderers } from '../email.templates';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly domain: string;
  private readonly sender: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly mailgunService: MailgunService,
  ) {
    this.domain = this.configService.getOrThrow('MAILGUN_DOMAIN');
    this.sender = this.configService.getOrThrow('MAILGUN_EMAIL_SENDER');
  }

  async send(dto: SendMailDTO): Promise<boolean> {
    const subject = MailerSubject?.[dto.template]?.[dto.locale]?.(
      dto.variables,
    );
    const html = MailerTextRenderers?.[dto.template]?.[dto.locale]?.(
      dto.variables,
    );
    if (!subject || !html) return false;
    const result = await this.mailgunService
      .createEmail(this.domain, {
        from: this.sender,
        to: dto.recipient,
        subject: subject,
        // text: data.text,
        html: html,
        // attachment: data.files,
      })
      .then(
        () => true,
        (err) => {
          console.log(err);
          this.logger.error(err);
          return false;
        },
      );
    return result;
  }
}
