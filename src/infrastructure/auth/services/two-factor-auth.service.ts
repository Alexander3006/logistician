import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';

@Injectable()
export class TwoFactorAuthenticationService {
  private readonly appName: string;
  constructor(private readonly configService: ConfigService) {
    this.appName = configService.getOrThrow(
      'TWO_FACTOR_AUTHENTICATION_APP_NAME',
    );
  }

  async generateSecret(
    email: string,
    secret?: string,
  ): Promise<{
    secret: string;
    url: string;
  }> {
    const secret2fa = secret || authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(email, this.appName, secret2fa);
    return {
      secret: secret2fa,
      url: otpAuthUrl,
    };
  }

  async verifyCode(code: string, secret: string): Promise<boolean> {
    return authenticator.verify({
      token: code,
      secret: secret,
    });
  }
}
