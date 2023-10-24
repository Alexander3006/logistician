import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';
import { VerificationQueryService } from '../services/verification-query.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { VerificationFilterDTO } from '../dto/verification-filter.dto';
import { GetPaginatedDTO } from 'src/common/dto/paginated.dto';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User, UserRoles } from 'src/domain/user/entities/user.entity';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ObjectType()
class VerificationPaginated extends GetPaginatedDTO(Verification) {}

@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRoles.ADMIN)
@Resolver(() => Verification)
export class AdminVerificationQueryResolver {
  constructor(
    private readonly verificationQueryService: VerificationQueryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => VerificationPaginated)
  async adminGetFilteredVerifications(
    @Args('payload') payload: VerificationFilterDTO,
    @AuthUser() user: User,
  ): Promise<VerificationPaginated> {
    const result = await this.verificationQueryService.getFilteredVerifications(
      payload,
    );
    return result;
  }
}
