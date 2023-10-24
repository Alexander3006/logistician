import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BalanceHistory } from './entities/balance-history.entity';
import { UserModule } from '../user/user.module';
import { BalanceHistoryQueryService } from './services/balance-history-query.service';
import { BalanceHistoryCommandService } from './services/balance-history-command.service';
import { CurrencyModule } from '../currency/currency.module';
import { BalanceHistoryQueryResolver } from './resolvers/balance-history-query.resolver';
import { BalanceHistoryResolver } from './resolvers/balance-history.resolver';
import { BalancePayment } from './entities/balance-payment.entity';
import { BalancePaymentCommandService } from './services/balance-payment-command.service';
import { BalancePaymentQueryService } from './services/balance-payment-query.service';
import { BalancePaymentResolver } from './resolvers/balance-payment.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceHistory, BalancePayment]),
    UserModule,
    CurrencyModule,
  ],
  providers: [
    //services
    BalanceHistoryQueryService,
    BalanceHistoryCommandService,
    BalancePaymentCommandService,
    BalancePaymentQueryService,
    //resolvers
    BalanceHistoryResolver,
    BalancePaymentResolver,
    BalanceHistoryQueryResolver,
  ],
  controllers: [],
  exports: [
    BalanceHistoryCommandService,
    BalancePaymentCommandService,
    BalancePaymentQueryService,
  ],
})
export class BalanceHistoryModule {}
