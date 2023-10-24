import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';
import { VerificationQueryService } from '../services/verification-query.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { VerificationFilterDTO } from '../dto/verification-filter.dto';
import { GetPaginatedDTO } from 'src/common/dto/paginated.dto';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User } from 'src/domain/user/entities/user.entity';

@ObjectType()
class VerificationPaginated extends GetPaginatedDTO(Verification) {}

@Resolver(() => Verification)
export class VerificationQueryResolver {
  constructor(
    private readonly verificationQueryService: VerificationQueryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => VerificationPaginated)
  async getFilteredVerifications(
    @Args('payload') payload: VerificationFilterDTO,
    @AuthUser() user: User,
  ): Promise<VerificationPaginated> {
    payload.filter.ownerId = user.id;
    const result = await this.verificationQueryService.getFilteredVerifications(
      payload,
    );
    return result;
  }
}
