import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { CurrencyQueryService } from './services/currency-query.service';
import { CurrencyCommandService } from './services/currency-command.service';
import { CurrencyQueryResolver } from './resolvers/currency-query.resolver';
import { AdminCurrencyCommandResolver } from './resolvers/admin-currency-command.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [
    //services
    CurrencyQueryService,
    CurrencyCommandService,
    //resolvers
    CurrencyQueryResolver,
    AdminCurrencyCommandResolver,
  ],
  controllers: [],
  exports: [CurrencyQueryService],
})
export class CurrencyModule {}
