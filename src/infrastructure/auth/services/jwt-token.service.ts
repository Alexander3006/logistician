import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../interfaces/jwt-token.payload';

@Injectable()
export class JWTTokenService {
  private readonly JWT_ACCESS_TOKEN_SECRET: string;
  private readonly JWT_ACCESS_TOKEN_EXPIRATION_TIME: string;
  private readonly JWT_REFRESH_TOKEN_SECRET: string;
  private readonly JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_SECRET = configService.getOrThrow(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    this.JWT_ACCESS_TOKEN_EXPIRATION_TIME = `${configService.getOrThrow(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}s`;
    this.JWT_REFRESH_TOKEN_SECRET = configService.getOrThrow(
      'JWT_REFRESH_TOKEN_SECRET',
    );
    this.JWT_REFRESH_TOKEN_EXPIRATION_TIME = `${configService.getOrThrow(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}s`;
  }

  async getTokenPairs(payload: JWTPayload): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const access_token = await this.jwtService.signAsync(
      {
        id: payload.id,
        email: payload.email,
        sessionId: payload.sessionId,
      },
      {
        secret: this.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: this.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      },
    );
    const refresh_token = await this.jwtService.signAsync(
      {
        id: payload.id,
        email: payload.email,
        sessionId: payload.sessionId,
      },
      {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: this.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      },
    );
    return { access_token, refresh_token };
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    return await this.jwtService.verifyAsync<JWTPayload>(token, {
      secret: this.JWT_ACCESS_TOKEN_SECRET,
    });
  }
}
