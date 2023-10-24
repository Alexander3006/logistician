import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWTPayload } from '../interfaces/jwt-token.payload';
import { User } from 'src/domain/user/entities/user.entity';
import { RedisStorageService } from 'src/infrastructure/memory-storage/services/redis-storage.service';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { UserWithSessionId } from '../decorators/auth-user.decorator';
import { SessionQueryService } from 'src/domain/user/services/session-query.service';

export const StrategyName = 'jwt-refresh';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  StrategyName,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userQueryService: UserQueryService,
    private readonly sessionQueryService: SessionQueryService,
    private readonly redisStorageService: RedisStorageService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-refresh-token'),
      // ignoreExpiration: true,
      secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JWTPayload,
  ): Promise<UserWithSessionId | boolean> {
    const expiration = this.configService.getOrThrow(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );
    const token = req.headers['x-refresh-token'];
    const key = `x-refresh-token:${token}`;
    const exist = await this.redisStorageService.get(key);
    if (exist) return false;
    try {
      const session = await this.sessionQueryService.getSession(
        payload.sessionId,
      );
      if (!session || !session?.active) return false;
      if (session.refreshToken !== token) return false;
      const user = session.user;
      if (!user || !user.isEmailVerified) return false;
      return { ...user, sessionId: payload.sessionId } as UserWithSessionId;
    } finally {
      await this.redisStorageService
        .set(key, true, expiration)
        .catch(console.log);
    }
  }
}
