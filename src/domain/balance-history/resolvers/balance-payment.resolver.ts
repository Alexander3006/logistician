import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BalancePayment } from '../entities/balance-payment.entity';
import { BalanceHistoryQueryService } from '../services/balance-history-query.service';
import { BalanceHistory } from '../entities/balance-history.entity';

@Resolver(() => BalancePayment)
export class BalancePaymentResolver {
  constructor(
    private readonly balanceHistoryQueryService: BalanceHistoryQueryService,
  ) {}

  @ResolveField(() => BalanceHistory, { nullable: true })
  async senderBalanceHistory(
    @Parent() { senderBalanceHistoryId }: BalancePayment,
  ): Promise<BalanceHistory> {
    return await this.balanceHistoryQueryService.getBalanceHistory({
      id: senderBalanceHistoryId,
    });
  }

  @ResolveField(() => BalanceHistory, { nullable: true })
  async recipientBalanceHistory(
    @Parent() { recipientBalanceHistoryId }: BalancePayment,
  ): Promise<BalanceHistory> {
    return await this.balanceHistoryQueryService.getBalanceHistory({
      id: recipientBalanceHistoryId,
    });
  }
}
