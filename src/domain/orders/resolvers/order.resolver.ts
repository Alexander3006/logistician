import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { CargoTypeQueryService } from 'src/domain/cars/services/cargo-type-query.service';
import { CurrencyQueryService } from 'src/domain/currency/services/currency-query.service';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { OrderRequestQueryService } from '../services/order-request-query.service';
import { User } from 'src/domain/user/entities/user.entity';
import { OrderRequest } from '../entities/order-request.entity';
import { Currency } from 'src/domain/currency/entities/currency.entity';
import { CargoType } from 'src/domain/cars/entities/cargo-type.entity';
import { BalancePayment } from 'src/domain/balance-history/entities/balance-payment.entity';
import { BalancePaymentQueryService } from 'src/domain/balance-history/services/balance-payment-query.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly cargoTypeQueryService: CargoTypeQueryService,
    private readonly currencyQueryService: CurrencyQueryService,
    private readonly userQueryService: UserQueryService,
    private readonly orderRequestQueryService: OrderRequestQueryService,
    private readonly balancePaymentQueryService: BalancePaymentQueryService,
  ) {}

  @ResolveField()
  async owner(@Parent() { ownerId }: Order): Promise<User> {
    return await this.userQueryService.getUser({ id: ownerId });
  }

  @ResolveField()
  async acceptedRequest(
    @Parent() { acceptedRequestId }: Order,
  ): Promise<OrderRequest> {
    return await this.orderRequestQueryService.getOrderRequest(
      acceptedRequestId,
    );
  }

  @ResolveField()
  async currency(@Parent() { currencyId }: Order): Promise<Currency> {
    return await this.currencyQueryService.getCurrency(currencyId);
  }

  @ResolveField()
  async cargoType(@Parent() { cargoTypeId }: Order): Promise<CargoType> {
    return await this.cargoTypeQueryService.getCargoType(cargoTypeId);
  }

  @ResolveField()
  async balancePayment(
    @Parent() { balancePaymentId }: Order,
  ): Promise<BalancePayment> {
    return await this.balancePaymentQueryService.getBalancePayment({
      id: balancePaymentId,
    });
  }

  @ResolveField()
  async balanceCompensaction(
    @Parent() { balanceCompensationId }: Order,
  ): Promise<BalancePayment> {
    return await this.balancePaymentQueryService.getBalancePayment({
      id: balanceCompensationId,
    });
  }
}
