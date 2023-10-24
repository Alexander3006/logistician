import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthStrategyManager } from 'src/infrastructure/auth/services/strategy-manager.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JWTTokenService } from 'src/infrastructure/auth/services/jwt-token.service';
import { LoginUserInput, LoginUserResponse } from '../dto/login-user.dto';
import { StrategyTypes } from 'src/infrastructure/auth/interfaces/strategy-service.interface';
import { TwoFactorAuthenticationService } from 'src/infrastructure/auth/services/two-factor-auth.service';
import { v4 as uuid } from 'uuid';
import { SessionCommandService } from './session-command.service';
import { SessionQueryService } from './session-query.service';
import { UserWithSessionId } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { AppException } from 'src/common/exceptions';
import { UserErrorCode } from '../constants';

export class UserAuthServiceException extends AppException {}

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>,
    private readonly authStrategyManager: AuthStrategyManager,
    private readonly jwtTokenService: JWTTokenService,
    private readonly twoFAService: TwoFactorAuthenticationService,
    private readonly sessionCommandService: SessionCommandService,
    private readonly sessionQueryService: SessionQueryService,
  ) {}

  async login(
    loginUserInput: LoginUserInput,
    { device, ip }: { device?: string; ip?: string } = {},
  ): Promise<LoginUserResponse> {
    const userData = await this.authStrategyManager.getUserData(
      loginUserInput.strategy,
      loginUserInput,
    );
    const user = await this.userRepositoty.findOne({
      where: { email: userData.email },
    });
    if (!user)
      throw new UserAuthServiceException({
        message: `User with email ${userData.email} not found`,
        code: UserErrorCode.USER_NOT_FOUND,
        statusCode: 404,
      });
    if (!user.isEmailVerified)
      throw new UserAuthServiceException({
        message: 'Account not activated, please verify your email',
        code: UserErrorCode.ACCOUNT_NOT_ACTIVATED,
        statusCode: 403,
      });
    const verified = await this.authStrategyManager.verifyUser(
      loginUserInput.strategy,
      user,
      { email: userData.email, password: loginUserInput.password },
    );
    if (!verified)
      throw new UserAuthServiceException({
        message: 'Invalid credentials',
        code: UserErrorCode.INVALID_CREDENTIALS,
        statusCode: 403,
      });
    if (
      // loginUserInput.strategy !== StrategyTypes.LOCAL ||
      !user.isTwoFAEnabled
    ) {
      const sessionId = uuid();
      const tokens = await this.jwtTokenService.getTokenPairs({
        ...user,
        sessionId,
      });
      await this.sessionCommandService.createSession({
        id: sessionId,
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        ip: ip,
        device: device,
      });
      return { user, tokens };
    }
    //local 2fa
    const validTwoFACode = await this.twoFAService.verifyCode(
      loginUserInput.code,
      user.twoFASecret,
    );
    if (validTwoFACode) {
      const sessionId = uuid();
      const tokens = await this.jwtTokenService.getTokenPairs({
        ...user,
        sessionId,
      });
      await this.sessionCommandService.createSession({
        id: sessionId,
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        ip: ip,
        device: device,
      });
      return {
        user,
        tokens,
      };
    }
    return {
      user: user,
      tokens: null,
    };
  }

  async refreshTokens(
    userWithSessionId: UserWithSessionId,
    { device, ip }: { device?: string; ip?: string } = {},
  ): Promise<LoginUserResponse> {
    const tokens = await this.jwtTokenService.getTokenPairs(userWithSessionId);
    await this.sessionCommandService.refreshSession({
      id: userWithSessionId.sessionId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      ip: ip,
      device: device,
    });
    return { user: userWithSessionId, tokens };
  }
}
