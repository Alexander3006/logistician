import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrderRequest } from '../entities/order-request.entity';
import { IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { OrderRequestFilterDTO } from '../dto/filter-order-request.dto';

@Injectable()
export class OrderRequestQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getOrderRequest(
    orderRequestId: string,
    em?: EntityManager,
  ): Promise<OrderRequest> {
    const repository = em
      ? em.getRepository(OrderRequest)
      : this.entityManager.getRepository(OrderRequest);
    const order = await repository.findOne({ where: { id: orderRequestId } });
    return order;
  }

  async getFilteredOrderRequests(
    dto: OrderRequestFilterDTO,
    em?: EntityManager,
  ): Promise<IPaginatedDTO<OrderRequest>> {
    const repository = em
      ? em.getRepository(OrderRequest)
      : this.entityManager.getRepository(OrderRequest);

    const { sort, pagination, filter } = dto;
    const alias = 'order_request';
    const query = repository.createQueryBuilder(alias);

    if ('id' in filter) {
      query.andWhere(`${alias}.id = :id`, {
        id: filter.id,
      });
    }
    if ('carId' in filter) {
      query.andWhere(`${alias}.carId = :carId`, {
        carId: filter.carId,
      });
    }
    if ('orderId' in filter) {
      query.andWhere(`${alias}.orderId = :orderId`, {
        orderId: filter.orderId,
      });
    }
    if ('ownerId' in filter) {
      query.andWhere(`${alias}.ownerId = :ownerId`, {
        ownerId: filter.ownerId,
      });
    }
    if ('status' in filter) {
      query.andWhere(`${alias}.status = :status`, {
        status: filter.status,
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
}
