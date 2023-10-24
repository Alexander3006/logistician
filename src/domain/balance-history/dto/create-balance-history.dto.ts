import { BalanceHistoryType } from '../entities/balance-history.entity';

export class CreateBalanceHistoryDTO {
  userId: string;
  type: BalanceHistoryType;
  inAmount: string;
  outAmount: string;
  feeAmount?: string;
  inCurrencyId: string;
  outCurrencyId: string;
  feeCurrencyId?: string;
  paymentMethodId?: string;
}
