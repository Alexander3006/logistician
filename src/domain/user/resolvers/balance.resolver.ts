import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserBalance } from '../entities/user-balance.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { UserQueryService } from '../services/user-query.service';
import { Currency } from 'src/domain/currency/entities/currency.entity';
import { CurrencyQueryService } from 'src/domain/currency/services/currency-query.service';

@Resolver(() => UserBalance)
export class UserBalanceResolver {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly currencyQueryService: CurrencyQueryService,
  ) {}

  @ResolveField(() => User)
  async user(@Parent() { userId }: UserBalance): Promise<User> {
    return await this.userQueryService.getUser({ id: userId });
  }

  @ResolveField(() => Currency)
  async currency(@Parent() { currencyId }: UserBalance): Promise<Currency> {
    return await this.currencyQueryService.getCurrency(currencyId);
  }
}
