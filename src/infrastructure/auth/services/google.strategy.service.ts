import { Injectable } from '@nestjs/common';
import {
  IStrategyService,
  OAuthCredentials,
  UserData,
} from '../interfaces/strategy-service.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleStrategyService implements IStrategyService {
  private readonly clienId: string;
  private readonly clientSecret: string;
  constructor(private readonly configService: ConfigService) {
    this.clienId = configService.getOrThrow('GOOGLE_AUTH_CLIENT_ID');
    this.clientSecret = configService.getOrThrow('GOOGLE_AUTH_CLIENT_SECRET');
  }

  async getUserData(credentials: OAuthCredentials): Promise<UserData> {
    const access_token = await this.getAccessTokenByCode(credentials.code);
    const google_user = await this.getUserDataByToken(access_token);
    // console.log(google_user);
    const data: UserData = {
      email: google_user.email,
      name: google_user.given_name,
      lastname: google_user.family_name,
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

  private async getAccessTokenByCode(
    code: string,
    redirectUri?: string,
  ): Promise<string | null> {
    return await axios
      .post('https://oauth2.googleapis.com/token', {
        code,
        client_id: this.clienId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri:
          redirectUri || this.configService.get('GOOGLE_OAUTH_REDIRECT'),
      })
      .then((r) => r.data?.access_token)
      .catch((x) => x.response);
  }

  private async getUserDataByToken(googleAccessToken: string): Promise<{
    email: string;
    given_name: string;
    family_name: string;
  } | null> {
    return await axios
      .get(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        params: {
          access_token: googleAccessToken,
        },
      })
      .then((x) => x.data);
  }
}
