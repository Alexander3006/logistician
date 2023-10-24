import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { VerificationCommandService } from '../services/verification-command.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { CreateVerificationDTO } from '../dto/create-verification.dto';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User } from 'src/domain/user/entities/user.entity';

@Resolver(() => Verification)
export class VerificationCommandResolver {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly verificationCommandService: VerificationCommandService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Verification)
  async createVerificationRequest(
    @Args('payload') payload: CreateVerificationDTO,
    @AuthUser() user: User,
  ): Promise<Verification> {
    const verification =
      await this.verificationCommandService.createVerification(
        user.id,
        payload,
      );
    return verification;
  }
}
