import { Injectable } from '@nestjs/common';
import {
  IStrategyService,
  OAuthCredentials,
  UserData,
} from '../interfaces/strategy-service.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FacebookStrategyService implements IStrategyService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  constructor(private readonly configService: ConfigService) {
    this.clientId = configService.getOrThrow('FACEBOOK_AUTH_CLIENT_ID');
    this.clientSecret = configService.getOrThrow('FACEBOOK_AUTH_CLIENT_SECRET');
  }

  async getUserData(credentials: OAuthCredentials): Promise<UserData> {
    const access_token = await this.getAccessTokenByCode(credentials.code);
    const facebook_user = await this.getUserDataByToken(access_token);
    const data: UserData = {
      email: facebook_user.email,
      name: facebook_user.first_name,
      lastname: facebook_user.last_name,
      isEmailVerified: true,
    };
    return data;
  }

  async verifyUser(
    credentials: OAuthCredentials,
    request: OAuthCredentials,
  ): Promise<boolean> {
    return credentials.email === request.email;
  }

  async getAccessTokenByCode(
    code: string,
    redirectUri?: string,
  ): Promise<string | null> {
    const { data } = await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'GET',
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri:
          redirectUri || this.configService.get('FACEBOOK_OAUTH_REDIRECT'),
        code,
      },
    });
    return data.access_token as string;
  }

  async getUserDataByToken(facebookAccessToken: string): Promise<{
    email: string;
    first_name: string;
    last_name: string;
  }> {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'GET',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: facebookAccessToken,
      },
    });
    return data;
  }
}
