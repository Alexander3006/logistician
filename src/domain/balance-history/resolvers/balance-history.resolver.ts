import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BalanceHistory } from '../entities/balance-history.entity';
import { Currency } from 'src/domain/currency/entities/currency.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { CurrencyQueryService } from 'src/domain/currency/services/currency-query.service';

@Resolver(() => BalanceHistory)
export class BalanceHistoryResolver {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly currencyQueryService: CurrencyQueryService,
  ) {}

  @ResolveField(() => Currency)
  async inCurrency(
    @Parent() { inCurrencyId }: BalanceHistory,
  ): Promise<Currency> {
    return await this.currencyQueryService.getCurrency(inCurrencyId);
  }

  @ResolveField(() => Currency)
  async outCurrency(
    @Parent() { outCurrencyId }: BalanceHistory,
  ): Promise<Currency> {
    return await this.currencyQueryService.getCurrency(outCurrencyId);
  }

  @ResolveField(() => Currency)
  async feeCurrency(
    @Parent() { feeCurrencyId }: BalanceHistory,
  ): Promise<Currency> {
    return await this.currencyQueryService.getCurrency(feeCurrencyId);
  }

  @ResolveField(() => User)
  async user(@Parent() { userId }: BalanceHistory): Promise<User> {
    return await this.userQueryService.getUser({ id: userId });
  }
}
