import { Controller, Get, Query } from '@nestjs/common';
import { GeetestService } from 'nestjs-geetest';
import { RealIP } from 'nestjs-real-ip';

@Controller('captcha')
export class CaptchaController {
  constructor(private geetestService: GeetestService) {}

  @Get('/')
  register(@Query('t') t: string, @RealIP() ip: string) {
    return this.geetestService.register({
      ip_address: ip,
      client_type: 'web',
      t,
    });
  }
}
