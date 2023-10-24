import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  OrderFeedbackFilterDTO,
  OrderFeedbackFilterOptionsDTO,
} from '../dto/filter-order-feedback.dto';
import { IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { OrderFeedback } from '../entities/order-feedback.entity';

@Injectable()
export class OrderFeedbackQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getFilteredOrderFeedbacks(
    dto: OrderFeedbackFilterDTO,
    em?: EntityManager,
  ): Promise<IPaginatedDTO<OrderFeedback>> {
    const repository = em
      ? em.getRepository(OrderFeedback)
      : this.entityManager.getRepository(OrderFeedback);

    const { sort, pagination, filter } = dto;
    const alias = 'feedback';
    const query = repository.createQueryBuilder(alias);

    if ('id' in filter) {
      query.andWhere(`${alias}.id = :id`, {
        id: filter.id,
      });
    }
    if ('customerId' in filter) {
      query.andWhere(`${alias}.customerId = :customerId`, {
        customerId: filter.customerId,
      });
    }
    if ('executorId' in filter) {
      query.andWhere(`${alias}.executorId = :executorId`, {
        executorId: filter.executorId,
      });
    }
    if ('orderId' in filter) {
      query.andWhere(`${alias}.orderId = :orderId`, {
        orderId: filter.orderId,
      });
    }

    query.orderBy(`${alias}.${sort.column}`, sort.direction);

    if (pagination) {
      query.skip(+pagination.from);
      query.take(+pagination.to + 1 - +pagination.from);
    }

    const [data, count] = await query.getManyAndCount();
    return {
      count,
      data,
    };
  }

  async getOrderFeedbackStats(
    filter: OrderFeedbackFilterOptionsDTO,
    em?: EntityManager,
  ): Promise<number> {
    const repository = em
      ? em.getRepository(OrderFeedback)
      : this.entityManager.getRepository(OrderFeedback);

    const alias = 'feedback';
    const query = repository.createQueryBuilder(alias);

    if ('customerId' in filter) {
      query.andWhere(`${alias}.customerId = :customerId`, {
        customerId: filter.customerId,
      });
    }
    if ('executorId' in filter) {
      query.andWhere(`${alias}.executorId = :executorId`, {
        executorId: filter.executorId,
      });
    }

    query.select(`SUM(${alias}.rating) / COUNT(${alias}.rating)`, 'rating');

    const { rating } = await query.getRawOne<{ rating: number }>();
    return rating;
  }
}
