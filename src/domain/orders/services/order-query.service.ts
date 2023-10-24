import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Order } from '../entities/order.entity';
import { IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { OrderFilterDTO } from '../dto/filter-order.dto';

@Injectable()
export class OrderQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getOrder(
    orderId: string,
    em?: EntityManager,
    relations: string[] = [],
  ): Promise<Order> {
    const repository = em
      ? em.getRepository(Order)
      : this.entityManager.getRepository(Order);
    const order = await repository.findOne({
      where: { id: orderId },
      relations,
    });
    return order;
  }

  async getFilteredOrders(
    payload: OrderFilterDTO,
    em?: EntityManager,
  ): Promise<IPaginatedDTO<Order>> {
    const repository = em
      ? em.getRepository(Order)
      : this.entityManager.getRepository(Order);

    const { sort, pagination, filter } = payload;
    const alias = 'order';
    const query = repository.createQueryBuilder(alias);

    if ('id' in filter) {
      query.andWhere(`${alias}.id = :id`, {
        id: filter.id,
      });
    }
    if ('cargoTypeId' in filter) {
      query.andWhere(`${alias}.cargoTypeId = :cargoTypeId`, {
        cargoTypeId: filter.cargoTypeId,
      });
    }
    if ('minDate' in filter) {
      query.andWhere(`${alias}.date >= :minDate`, { minDate: filter.minDate });
    }
    if ('maxDate' in filter) {
      query.andWhere(`${alias}.date <= :maxDate`, { maxDate: filter.maxDate });
    }
    if ('minPrice' in filter) {
      query.andWhere(`${alias}.price >= :minPrice`, {
        minPrice: filter.minPrice,
      });
    }
    if ('maxPrice' in filter) {
      query.andWhere(`${alias}.price <= :maxPrice`, {
        maxPrice: filter.maxPrice,
      });
    }
    if ('minVolume' in filter) {
      query.andWhere(`${alias}.volume >= :minVolume`, {
        minVolume: filter.minVolume,
      });
    }
    if ('maxVolume' in filter) {
      query.andWhere(`${alias}.volume <= :maxVolume`, {
        maxVolume: filter.maxVolume,
      });
    }
    if ('minWeight' in filter) {
      query.andWhere(`${alias}.weight >= :minWeight`, {
        minWeight: filter.minWeight,
      });
    }
    if ('maxWeight' in filter) {
      query.andWhere(`${alias}.weight <= :maxWeight`, {
        maxWeight: filter.maxWeight,
      });
    }
    if ('ownerId' in filter) {
      query.andWhere(`${alias}.ownerId = :ownerId`, {
        ownerId: filter.ownerId,
      });
    }
    if ('currencyId' in filter) {
      query.andWhere(`${alias}.currencyId = :currencyId`, {
        currencyId: filter.currencyId,
      });
    }
    if ('status' in filter) {
      query.andWhere(`${alias}.status = :status`, { status: filter.status });
    }
    if ('acceptedRequestId' in filter) {
      query.andWhere(`${alias}.acceptedRequestId = :acceptedRequestId`, {
        acceptedRequestId: filter.acceptedRequestId,
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
