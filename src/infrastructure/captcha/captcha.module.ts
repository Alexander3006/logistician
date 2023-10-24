import { Module } from '@nestjs/common';
import { CaptchaController } from './controllers/captcha.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeetestModule } from 'nestjs-geetest';

@Module({
  providers: [],
  controllers: [CaptchaController],
  imports: [
    ConfigModule,
    GeetestModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        geetestId: configService.get('GEETEST_ID', ''),
        geetestKey: configService.get('GEETEST_KEY', ''),
      }),
    }),
  ],
})
export class CaptchaModule {}
