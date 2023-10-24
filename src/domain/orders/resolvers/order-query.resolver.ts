import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { OrderQueryService } from '../services/order-query.service';
import { GetPaginatedDTO } from 'src/common/dto/paginated.dto';
import { OrderFilterDTO } from '../dto/filter-order.dto';

@ObjectType()
export class OrderPaginater extends GetPaginatedDTO(Order) {}

@Resolver(() => Order)
export class OrderQueryResolver {
  constructor(private readonly orderQueryService: OrderQueryService) {}

  @Query(() => OrderPaginater)
  async getFilteredOrders(
    @Args('payload') payload: OrderFilterDTO,
  ): Promise<OrderPaginater> {
    const result = await this.orderQueryService.getFilteredOrders(payload);
    return result;
  }
}
