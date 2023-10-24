import { Injectable } from '@nestjs/common';
import {
  IStrategyService,
  LocalCredentials,
  OAuthCredentials,
  UserData,
} from '../interfaces/strategy-service.interface';
import * as AspNetIdentityHasher from 'aspnet-identity-pw';

export class LocalStrategyServiceError extends Error {}

@Injectable()
export class LocalStrategyService implements IStrategyService {
  constructor() {}

  async getUserData(credentials: LocalCredentials): Promise<UserData> {
    if (!credentials.email || !credentials.password)
      throw new LocalStrategyServiceError(
        'Invalid credentials for local strategy',
      );
    const hash: string = await new Promise((res, rej) => {
      AspNetIdentityHasher.hashPassword(
        credentials.password,
        (err: Error, data: string) => {
          if (err) return rej(err);
          return res(data);
        },
      );
    });
    const data: UserData = {
      ...credentials,
      isEmailVerified: false,
      password: hash,
    };
    return data;
  }

  async verifyUser(
    credentials: LocalCredentials,
    request: LocalCredentials,
  ): Promise<boolean> {
    if (!credentials.email || !credentials.password)
      throw new LocalStrategyServiceError(
        'Invalid credentials for local strategy',
      );
    const verified: boolean = await new Promise((res, rej) => {
      AspNetIdentityHasher.validatePassword(
        request.password,
        credentials.password,
        (err: Error, data: boolean) => {
          if (err) return rej(err);
          return res(data);
        },
      );
    });
    return verified;
  }
}
