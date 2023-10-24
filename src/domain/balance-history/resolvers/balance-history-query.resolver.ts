import { UseGuards } from '@nestjs/common';
import { BalanceHistoryQueryService } from '../services/balance-history-query.service';
import { BalanceHistory } from '../entities/balance-history.entity';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { BalanceHistorFilterDTO } from '../dto/balance-history-filter.dto';
import { GetPaginatedDTO } from 'src/common/dto/paginated.dto';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User } from 'src/domain/user/entities/user.entity';
import {
  BalanceHistorStatsDTO,
  BalanceHistoryStatsResponse,
} from '../dto/balance-history-stats.dto';
import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
class BalanceHistoryPaginated extends GetPaginatedDTO(BalanceHistory) {}

@Resolver(() => BalanceHistory)
export class BalanceHistoryQueryResolver {
  constructor(
    private readonly balanceHistoryQueryService: BalanceHistoryQueryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => BalanceHistoryPaginated)
  async getFilteredBalanceHistory(
    @AuthUser() user: User,
    @Args('payload') dto: BalanceHistorFilterDTO,
  ): Promise<BalanceHistoryPaginated> {
    const result =
      await this.balanceHistoryQueryService.getFilteredBalanceHistory(
        user.id,
        dto,
      );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => BalanceHistoryStatsResponse)
  async getBalanceHistoryStats(
    @AuthUser() user: User,
    @Args('payload') dto: BalanceHistorStatsDTO,
  ): Promise<BalanceHistoryStatsResponse> {
    const result = await this.balanceHistoryQueryService.getBalanceHistoryStats(
      user.id,
      dto,
    );
    return result;
  }
}
