import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JWTPayload } from '../interfaces/jwt-token.payload';
import { User } from 'src/domain/user/entities/user.entity';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { UserWithSessionId } from '../decorators/auth-user.decorator';
import { IncomingMessage } from 'http';
import { SessionQueryService } from 'src/domain/user/services/session-query.service';

export const StrategyName = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, StrategyName) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userQueryService: UserQueryService,
    private readonly sessionQueryService: SessionQueryService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   ignoreExpiration: true,
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request | IncomingMessage,
    payload: JWTPayload,
  ): Promise<UserWithSessionId | boolean> {
    const session = await this.sessionQueryService.getSession(
      payload.sessionId,
    );
    if (!session || !session?.active) return false;
    const user = session.user;
    // const user = await this.userQueryService.getUser({ id: payload.id });
    if (!user || !user.isEmailVerified) return false;
    return {
      ...user,
      sessionId: payload.sessionId,
      locale: session.locale,
    } as UserWithSessionId;
  }
}
