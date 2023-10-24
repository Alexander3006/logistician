import { ConfigService } from '@nestjs/config';
import { MailgunModule as MM } from '@nextnm/nestjs-mailgun';

export const MailgunModule = MM.forAsyncRoot({
  useFactory: (configService: ConfigService) => {
    const config = {
      username: configService.getOrThrow('MAILGUN_USERNAME', 'api'),
      key: configService.getOrThrow('MAILGUN_API_KEY'),
      url: configService.getOrThrow(
        'MAILGUN_API_URL',
        'https://api.eu.mailgun.net',
      ),
    };
    return config;
  },
  inject: [ConfigService],
});
