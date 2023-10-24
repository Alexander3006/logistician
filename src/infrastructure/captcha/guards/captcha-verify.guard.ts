import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

import { GeetestService } from 'nestjs-geetest';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CaptchaVerifyGuard implements CanActivate {
  private readonly logger = new Logger(CaptchaVerifyGuard.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly geetestService: GeetestService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.configService.get('DISABLE_CAPTCHA')) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const geetestChallenge = request.body.variables?.captcha?.geetest_challenge;
    const geetestValidate = request.body.variables?.captcha?.geetest_validate;
    const geetestSeccode = request.body.variables?.captcha?.geetest_seccode;

    if (!geetestChallenge || !geetestValidate || !geetestSeccode) return false;

    const result = await this.geetestService.validate(
      geetestChallenge,
      geetestValidate,
      geetestSeccode,
    );

    return !!result.status;
  }
}
