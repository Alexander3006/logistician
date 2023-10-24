import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserAuthService } from '../services/user-auth.service';
import { LoginUserInput, LoginUserResponse } from '../dto/login-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from 'src/infrastructure/auth/guards/jwt-refresh-auth.guard';
import {
  AuthUser,
  UserWithSessionId,
} from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import {
  RateLimiterLogin,
  RateLimiterRefreshTokens,
} from '../guards/rate-limiter.guard';

@Resolver(() => User)
export class UserAuthResolver {
  constructor(private readonly userAuthService: UserAuthService) {}

  @UseGuards(RateLimiterLogin)
  @Query(() => LoginUserResponse, { name: 'login' })
  async login(
    @Args('credentials') creadentials: LoginUserInput,
  ): Promise<LoginUserResponse> {
    const result = await this.userAuthService.login(creadentials);
    return result;
  }

  @UseGuards(JwtRefreshAuthGuard, RateLimiterRefreshTokens)
  @Query(() => LoginUserResponse, { name: 'refreshTokens' })
  async refreshTokens(
    @AuthUser() user: UserWithSessionId,
  ): Promise<LoginUserResponse> {
    if (!user) throw new Error('User not found');
    const result = await this.userAuthService.refreshTokens(user);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async getMe(@AuthUser() user: User): Promise<User> {
    return User.create(user);
  }
}
