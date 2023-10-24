import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EmailVerificationService } from '../services/email-verification.service';
import { EmailVerificationPayloadInput } from '../dto/verify-email.input';
import { UseGuards } from '@nestjs/common';
import {
  RateLimiterEmailVerificationRequest,
  RateLimiterEmailVerify,
} from '../guards/rate-limiter.guard';

@Resolver()
export class EmailVerificationResolver {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @UseGuards(RateLimiterEmailVerificationRequest)
  @Query(() => Boolean, { name: 'sendEmailVerificationCode' })
  async sendEmailVerificationCode(
    @Args('email') email: string,
  ): Promise<boolean> {
    return await this.emailVerificationService.requestEmailVerification(email);
  }

  @UseGuards(RateLimiterEmailVerify)
  @Mutation(() => Boolean, { name: 'verifyEmail' })
  async verifyEmail(
    @Args('payload') verifyEmailPayload: EmailVerificationPayloadInput,
  ): Promise<boolean> {
    const { email, code } = verifyEmailPayload;
    return await this.emailVerificationService.verifyEmail(email, code);
  }
}
