import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AddressType, Order } from '../entities/order.entity';
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
import { LocationQueryService } from 'src/domain/location/services/location-query.service';
import {
  Location,
  LocationOwner,
} from 'src/domain/location/entities/location.entity';
import { AddressQueryService } from 'src/domain/location/services/address-query.service';
import {
  Address,
  AddressOwner,
} from 'src/domain/location/entities/addess.entity';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly addressQueryService: AddressQueryService,
    private readonly locationQueryService: LocationQueryService,
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

  @ResolveField(() => [Location])
  async locations(@Parent() { id }: Order): Promise<Location[]> {
    const locations = await this.locationQueryService.getLocationByOwner(
      id,
      LocationOwner.ORDER,
    );
    return locations;
  }

  @ResolveField(() => [Address])
  async toAddresses(@Parent() { id }: Order): Promise<Address[]> {
    const addresses = await this.addressQueryService.getAddressByOwner(
      id,
      AddressOwner.ORDER,
      {
        description: AddressType.UNLOADING,
      },
    );
    return addresses;
  }

  @ResolveField(() => [Address])
  async fromAddresses(@Parent() { id }: Order): Promise<Address[]> {
    const addresses = await this.addressQueryService.getAddressByOwner(
      id,
      AddressOwner.ORDER,
      {
        description: AddressType.LOADING,
      },
    );
    return addresses;
  }
}
