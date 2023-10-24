import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserCredentialsService } from '../services/user-credentials.service';
import { UpdatePasswordInput } from '../dto/update-password.input';
import { UseGuards } from '@nestjs/common';
import {
  RateLimiterTwoFACommon,
  RateLimiterUpdatePassword,
  RateLimiterUpdatePasswordCodeRequest,
} from '../guards/rate-limiter.guard';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User } from '../entities/user.entity';
import { TwoFASecret } from '../dto/two-fa-secret.dto';

@Resolver()
export class UserCredentialsResolver {
  constructor(
    private readonly userCredentialsService: UserCredentialsService,
  ) {}

  @UseGuards(RateLimiterUpdatePasswordCodeRequest)
  @Query(() => Boolean, { name: 'sendPasswordUpdateCode' })
  async sendPasswordUpdateCode(@Args('email') email: string): Promise<boolean> {
    return await this.userCredentialsService.updatePasswordCodeRequest(email);
  }

  @UseGuards(RateLimiterUpdatePassword)
  @Mutation(() => Boolean, { name: 'updatePasswordByOldPassword' })
  async updatePasswordByOldPassword(
    @Args('payload') payload: UpdatePasswordInput,
  ): Promise<Boolean> {
    return await this.userCredentialsService.updatePasswordByOldPassword(
      payload,
    );
  }

  @UseGuards(RateLimiterUpdatePassword)
  @Mutation(() => Boolean, { name: 'updatePasswordByCode' })
  async updatePasswordByCode(
    @Args('payload') payload: UpdatePasswordInput,
  ): Promise<Boolean> {
    return await this.userCredentialsService.updatePasswordByCode(payload);
  }

  //2FA
  @UseGuards(JwtAuthGuard, RateLimiterTwoFACommon)
  @Mutation(() => TwoFASecret, { name: 'generateTwoFASecret' })
  async generateTwoFASecret(
    @AuthUser() user: User,
    @Args('force', { type: () => Boolean, defaultValue: false, nullable: true })
    force: boolean,
  ): Promise<TwoFASecret> {
    return await this.userCredentialsService.generateTwoFASecret(
      user.id,
      force,
    );
  }

  @UseGuards(JwtAuthGuard, RateLimiterTwoFACommon)
  @Mutation(() => Boolean, { name: 'turnOnTwoFA' })
  async turnOnTwoFA(
    @AuthUser() user: User,
    @Args('code', { type: () => String }) code: string,
  ): Promise<boolean> {
    return await this.userCredentialsService.turnOnTwoFA(user.id, code);
  }

  @UseGuards(JwtAuthGuard, RateLimiterTwoFACommon)
  @Mutation(() => Boolean, { name: 'turnOffTwoFA' })
  async turnOffTwoFA(
    @AuthUser() user: User,
    @Args('code', { type: () => String }) code: string,
  ): Promise<boolean> {
    return await this.userCredentialsService.turnOffTwoFA(user.id, code);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => TwoFASecret, { name: 'getTwoFASecret' })
  async getTwoFASecret(@AuthUser() user: User): Promise<TwoFASecret> {
    return await this.userCredentialsService.getTwoFASecret(user.id);
  }
}
