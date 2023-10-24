import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrderFeedback } from '../entities/order-feedback.entity';
import { OrderQueryService } from 'src/domain/orders/services/order-query.service';
import { CreateOrderFeedbackDTO } from '../dto/create-order-feedback.dto';
import { OrderStatuses } from 'src/domain/orders/entities/order.entity';
import { AppException } from 'src/common/exceptions';

export class OrderFeedbackCommandServiceException extends AppException {}

@Injectable()
export class OrderFeedbackCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly orderQueryService: OrderQueryService,
  ) {}

  async createOrderFeedback(
    userId: string,
    dto: CreateOrderFeedbackDTO,
    em?: EntityManager,
  ): Promise<OrderFeedback> {
    const repository = em
      ? em.getRepository(OrderFeedback)
      : this.entityManager.getRepository(OrderFeedback);
    const order = await this.orderQueryService.getOrder(dto.orderId, em, [
      'acceptedRequest',
    ]);
    if (order.status === OrderStatuses.CREATED)
      throw new OrderFeedbackCommandServiceException({
        message: `Cannot estimate order with status ${order.status}`,
        code: 'INVALID_OPERATION',
        statusCode: 400,
      });
    const isCustomer = order.ownerId === userId;
    const isExecutor = order?.acceptedRequest?.ownerId;
    if (!isCustomer && !isExecutor)
      throw new OrderFeedbackCommandServiceException({
        message: `User ${userId} is not related to the order`,
        code: 'FORBIDDEB',
        statusCode: 403,
      });
    const entity = OrderFeedback.create({
      ...dto,
      executorId: isExecutor ? userId : null,
      customerId: isCustomer ? userId : null,
    });
    const feedback = await repository.save(entity);
    return feedback;
  }
}
