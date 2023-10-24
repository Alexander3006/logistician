import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderRequest } from '../entities/order-request.entity';
import { Order } from '../entities/order.entity';
import { OrderQueryService } from '../services/order-query.service';
import { CarQueryService } from 'src/domain/cars/services/car-query.service';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { User } from 'src/domain/user/entities/user.entity';
import { Car } from 'src/domain/cars/entities/car.entity';
import { LocationQueryService } from 'src/domain/location/services/location-query.service';
import {
  Location,
  LocationOwner,
} from 'src/domain/location/entities/location.entity';

@Resolver(() => OrderRequest)
export class OrderRequestResolver {
  constructor(
    private readonly carQueryService: CarQueryService,
    private readonly userQueryService: UserQueryService,
    private readonly orderQueryService: OrderQueryService,
    private readonly locationQueryService: LocationQueryService,
  ) {}

  @ResolveField()
  async order(@Parent() { orderId }: OrderRequest): Promise<Order> {
    return await this.orderQueryService.getOrder(orderId);
  }

  @ResolveField()
  async car(@Parent() { carId }: OrderRequest): Promise<Car> {
    return await this.carQueryService.getCar(carId);
  }

  @ResolveField()
  async owner(@Parent() { ownerId }: OrderRequest): Promise<User> {
    return await this.userQueryService.getUser({ id: ownerId });
  }

  @ResolveField(() => [Location])
  async locations(@Parent() { id }: User): Promise<Location[]> {
    const location = await this.locationQueryService.getLocationByOwner(
      id,
      LocationOwner.ORDER,
    );
    return [location];
  }
}
