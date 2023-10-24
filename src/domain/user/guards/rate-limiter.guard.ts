import { RateLimiterGuard, RateLimiterOptions } from 'nestjs-rate-limiter';
import { getClientIp } from '@supercharge/request-ip';
import { Request } from 'express';
import { JWTPayload } from 'src/infrastructure/auth/interfaces/jwt-token.payload';

interface AppRequest extends Request {
  user: JWTPayload;
}

export class RateLimiterBase extends RateLimiterGuard {
  protected getIpFromRequest(request: AppRequest): string {
    if (request.user) {
      return 'user:' + request.user.id;
    } else {
      return 'ip:' + getClientIp(request);
    }
  }
}

export class RateLimiterRegisterUser extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:user-register',
      duration: 30,
      points: 1,
    });
  }
}

export class RateLimiterLogin extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:user-login',
      duration: 60,
      points: 10,
    });
  }
}

export class RateLimiterEmailVerify extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:user-email-verify',
      duration: 120,
      points: 5,
    });
  }
}

export class RateLimiterEmailVerificationRequest extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:user-email-verification-request',
      duration: 60,
      points: 1,
    });
  }
}

export class RateLimiterUpdatePasswordCodeRequest extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:update-user-password-code-request',
      duration: 60,
      points: 1,
    });
  }
}

export class RateLimiterUpdatePassword extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:user-update-password',
      duration: 60,
      points: 1,
    });
  }
}

export class RateLimiterRefreshTokens extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:user-refresh-tokens',
      duration: 60,
      points: 5,
    });
  }
}

export class RateLimiterTwoFACommon extends RateLimiterBase {
  getRateLimiter(options?: RateLimiterOptions): Promise<any> {
    return super.getRateLimiter({
      ...options,
      keyPrefix: 'rate-limiter:user-two-fa-common',
      duration: 60,
      points: 10,
    });
  }
}
