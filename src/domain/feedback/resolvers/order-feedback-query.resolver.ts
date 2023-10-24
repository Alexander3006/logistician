import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { OrderFeedback } from '../entities/order-feedback.entity';
import { OrderFeedbackQueryService } from '../services/order-feedback-query.service';
import { GetPaginatedDTO } from 'src/common/dto/paginated.dto';
import {
  OrderFeedbackFilterDTO,
  OrderFeedbackFilterOptionsDTO,
} from '../dto/filter-order-feedback.dto';

@ObjectType()
export class OrderFeedbackPaginated extends GetPaginatedDTO(OrderFeedback) {}

@Resolver(() => OrderFeedback)
export class OrderFeedbackQueryResolver {
  constructor(
    private readonly orderFeedbackQueryService: OrderFeedbackQueryService,
  ) {}

  @Query(() => OrderFeedbackPaginated)
  async getFilteredOrderFeedbacks(
    @Args('payload') payload: OrderFeedbackFilterDTO,
  ): Promise<OrderFeedbackPaginated> {
    const result =
      await this.orderFeedbackQueryService.getFilteredOrderFeedbacks(payload);
    return result;
  }

  @Query(() => Number)
  async getOrderFeedbackStats(
    @Args('payload') payload: OrderFeedbackFilterOptionsDTO,
  ): Promise<number> {
    const result = await this.orderFeedbackQueryService.getOrderFeedbackStats(
      payload,
    );
    return result;
  }
}
