import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRequest } from './entities/order-request.entity';
import { UserModule } from '../user/user.module';
import { CurrencyModule } from '../currency/currency.module';
import { CarModule } from '../cars/car.module';
import { OrderQueryService } from './services/order-query.service';
import { OrderCommandService } from './services/order-command.service';
import { OrderRequestQueryService } from './services/order-request-query.service';
import { OrderResolver } from './resolvers/order.resolver';
import { OrderQueryResolver } from './resolvers/order-query.resolver';
import { OrderCommandResolver } from './resolvers/order-command.resolver';
import { BalanceHistoryModule } from '../balance-history/balance-history.module';
import { OrderRequestCommandService } from './services/order-request-command.service';
import { OrderRequestResolver } from './resolvers/order-request.resolver';
import { OrderRequestQueryResolver } from './resolvers/order-request-query.resolver';
import { OrderRequestCommandResolver } from './resolvers/order-request-command.resolver';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderRequest]),
    UserModule,
    CurrencyModule,
    CarModule,
    BalanceHistoryModule,
    LocationModule,
  ],
  providers: [
    //services
    OrderQueryService,
    OrderCommandService,
    OrderRequestQueryService,
    OrderRequestCommandService,
    //resolvers
    OrderResolver,
    OrderRequestResolver,
    OrderQueryResolver,
    OrderCommandResolver,
    OrderRequestQueryResolver,
    OrderRequestCommandResolver,
  ],
  controllers: [],
  exports: [OrderQueryService],
})
export class OrderModule {}
