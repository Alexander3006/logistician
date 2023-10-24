import { Query, Resolver } from '@nestjs/graphql';
import { Currency } from '../entities/currency.entity';
import { CurrencyQueryService } from '../services/currency-query.service';

@Resolver(() => Currency)
export class CurrencyQueryResolver {
  constructor(private readonly currencyQueryService: CurrencyQueryService) {}

  @Query(() => [Currency])
  async getCurrencies(): Promise<Currency[]> {
    const result = await this.currencyQueryService.getCurrencies();
    return result;
  }
}
