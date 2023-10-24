import { Injectable } from '@nestjs/common';
import { LocalStrategyService } from './local.strategy.service';
import { GoogleStrategyService } from './google.strategy.service';
import {
  IStrategyService,
  LocalCredentials,
  OAuthCredentials,
  StrategyTypes,
  UserData,
} from '../interfaces/strategy-service.interface';
import { FacebookStrategyService } from './facebook.strategy.service';

export class AuthStrategyManagerError extends Error {}

@Injectable()
export class AuthStrategyManager {
  private readonly strategies: Record<StrategyTypes, IStrategyService>;
  constructor(
    private readonly localStrategyService: LocalStrategyService,
    private readonly googleStrategyService: GoogleStrategyService,
    private readonly facebookStrategyService: FacebookStrategyService,
  ) {
    this.strategies = {
      [StrategyTypes.LOCAL]: localStrategyService,
      [StrategyTypes.GOOGLE]: googleStrategyService,
      [StrategyTypes.FACEBOOK]: facebookStrategyService,
    };
  }

  async getUserData(
    strategyType: StrategyTypes,
    credentials: OAuthCredentials | LocalCredentials,
  ): Promise<UserData> {
    const strategy = this.strategies[strategyType];
    if (!strategy)
      throw new AuthStrategyManagerError(
        `Auth strategy ${strategyType} not supported`,
      );
    return await strategy.getUserData(credentials);
  }

  async verifyUser(
    strategyType: StrategyTypes,
    credentials: OAuthCredentials | LocalCredentials,
    request: OAuthCredentials | LocalCredentials,
  ): Promise<boolean> {
    const strategy = this.strategies[strategyType];
    if (!strategy)
      throw new AuthStrategyManagerError(
        `Auth strategy ${strategyType} not supported`,
      );
    return await strategy.verifyUser(credentials, request);
  }
}
