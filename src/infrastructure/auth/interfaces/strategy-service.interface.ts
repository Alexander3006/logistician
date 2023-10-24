import { registerEnumType } from '@nestjs/graphql';

export enum StrategyTypes {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}
registerEnumType(StrategyTypes, { name: 'StrategyTypes' });

export type OAuthCredentials = {
  code?: string;
  email?: string;
};

export type LocalCredentials = {
  email: string;
  password: string;
  name?: string;
  lastname?: string;
};

export type UserData = {
  email: string;
  name?: string;
  lastname?: string;
  password?: string;
  isEmailVerified: boolean;
};

export interface IStrategyService {
  getUserData(
    credentials: OAuthCredentials | LocalCredentials,
  ): Promise<UserData>;

  verifyUser(
    credentials: OAuthCredentials | LocalCredentials,
    request: OAuthCredentials | LocalCredentials,
  ): Promise<boolean>;
}
