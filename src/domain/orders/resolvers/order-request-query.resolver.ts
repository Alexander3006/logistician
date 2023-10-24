import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { OrderRequest } from '../entities/order-request.entity';
import { OrderRequestQueryService } from '../services/order-request-query.service';
import { GetPaginatedDTO } from 'src/common/dto/paginated.dto';
import { OrderRequestFilterDTO } from '../dto/filter-order-request.dto';

@ObjectType()
export class OrderRequestPaginated extends GetPaginatedDTO(OrderRequest) {}

@Resolver(() => OrderRequest)
export class OrderRequestQueryResolver {
  constructor(
    private readonly orderRequestQueryService: OrderRequestQueryService,
  ) {}

  @Query(() => OrderRequestPaginated)
  async getFilteredOrderRequests(
    @Args('payload') payload: OrderRequestFilterDTO,
  ): Promise<OrderRequestPaginated> {
    const result = await this.orderRequestQueryService.getFilteredOrderRequests(
      payload,
    );
    return result;
  }
}
