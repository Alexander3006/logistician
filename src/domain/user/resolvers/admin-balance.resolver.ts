import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserBalance } from '../entities/user-balance.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoles } from '../entities/user.entity';
import { UserBalanceCommandService } from '../services/balance-command.service';
import { BalanceUpdateDTO } from '../dto/balance-update.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Resolver(() => UserBalance)
@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRoles.ADMIN)
export class AdminUserBalanceResolver {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userBalanceCommandService: UserBalanceCommandService,
  ) {}

  @Mutation(() => UserBalance)
  async incrementUserBalance(
    @Args('payload') payload: BalanceUpdateDTO,
  ): Promise<UserBalance> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.userBalanceCommandService.incrementBalance(
        payload.userId,
        payload.currencyId,
        payload.amount,
        em,
      );
      return result;
    });
  }

  @Mutation(() => UserBalance)
  async decrementUserBalance(
    @Args('payload') payload: BalanceUpdateDTO,
  ): Promise<UserBalance> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.userBalanceCommandService.decrementBalance(
        payload.userId,
        payload.currencyId,
        payload.amount,
        em,
      );
      return result;
    });
  }
}
