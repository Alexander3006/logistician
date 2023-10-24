import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { OrderFeedback } from '../entities/order-feedback.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { OrderQueryService } from 'src/domain/orders/services/order-query.service';
import { Order } from 'src/domain/orders/entities/order.entity';

@Resolver(() => OrderFeedback)
export class OrderFeedbackResolver {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly orderQueryService: OrderQueryService,
  ) {}

  @ResolveField()
  async customer(@Parent() { customerId }: OrderFeedback): Promise<User> {
    return await this.userQueryService.getUser({ id: customerId });
  }

  @ResolveField()
  async executor(@Parent() { executorId }: OrderFeedback): Promise<User> {
    return await this.userQueryService.getUser({ id: executorId });
  }

  @ResolveField()
  async order(@Parent() { orderId }: OrderFeedback): Promise<Order> {
    return await this.orderQueryService.getOrder(orderId);
  }
}
