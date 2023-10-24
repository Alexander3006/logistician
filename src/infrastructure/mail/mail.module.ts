import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './services/mail.service';
import { MailgunModule } from 'src/config/mailgun.module';

@Module({
  imports: [ConfigModule, MailgunModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
