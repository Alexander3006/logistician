import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { VerificationCommandService } from '../services/verification-command.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from 'src/domain/user/entities/user.entity';
import { UpdateVerificationDTO } from '../dto/update-verification.dto';

@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRoles.ADMIN)
@Resolver(() => Verification)
export class AdminVerificationCommandResolver {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly verificationCommandService: VerificationCommandService,
  ) {}

  @Mutation(() => Verification)
  async adminApproveVerification(
    @Args('payload') payload: UpdateVerificationDTO,
  ): Promise<Verification> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const verification =
        await this.verificationCommandService.approveVerification(payload, em);
      return verification;
    });
  }

  @Mutation(() => Verification)
  async adminRejectVerification(
    @Args('payload') payload: UpdateVerificationDTO,
  ): Promise<Verification> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const verification =
        await this.verificationCommandService.rejectVerification(payload, em);
      return verification;
    });
  }
}
