import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWTPayload } from '../interfaces/jwt-token.payload';
import { User } from 'src/domain/user/entities/user.entity';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { UserWithSessionId } from '../decorators/auth-user.decorator';

export const StrategyName = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyName) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userQueryService: UserQueryService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   ignoreExpiration: true,
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JWTPayload,
  ): Promise<UserWithSessionId | boolean> {
    const user = await this.userQueryService.getUser({ id: payload.id });
    if (!user || !user.isEmailVerified) return false;
    return { ...user, sessionId: payload.sessionId } as UserWithSessionId;
  }
}
