import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { BalanceHistory } from '../entities/balance-history.entity';
import { BalanceHistorFilterDTO } from '../dto/balance-history-filter.dto';
import {
  BalanceHistorStatsDTO,
  BalanceHistoryStatsByCurrency,
  BalanceHistoryStatsResponse,
} from '../dto/balance-history-stats.dto';
import { CurrencyQueryService } from 'src/domain/currency/services/currency-query.service';
import { AppException } from 'src/common/exceptions';
import BigNumber from 'bignumber.js';

export class BalanceHistoryQueryServiceException extends AppException {}

@Injectable()
export class BalanceHistoryQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly currencyQueryService: CurrencyQueryService,
  ) {}

  async getBalanceHistory(
    filter: FindOptionsWhere<BalanceHistory>,
    em?: EntityManager,
  ): Promise<BalanceHistory> {
    const repository = em
      ? em.getRepository(BalanceHistory)
      : this.entityManager.getRepository(BalanceHistory);
    const entity = repository.findOne({ where: filter });
    return entity;
  }

  async getFilteredBalanceHistory(
    userId: string,
    dto: BalanceHistorFilterDTO,
    em?: EntityManager,
  ): Promise<IPaginatedDTO<BalanceHistory>> {
    const repository = em
      ? em.getRepository(BalanceHistory)
      : this.entityManager.getRepository(BalanceHistory);

    const { sort, pagination, filter } = dto;
    const alias = 'balance_history';
    const query = repository.createQueryBuilder(alias);
    query.andWhere(`${alias}.userId = :userId`, { userId });

    if (filter.hasOwnProperty('id')) {
      query.andWhere(`${alias}.id = :id`, {
        id: filter.id,
      });
    }
    if (filter.hasOwnProperty('inCurrencyId')) {
      query.andWhere(`${alias}.inCurrencyId = :inCurrencyId`, {
        inCurrencyId: filter.inCurrencyId,
      });
    }
    if (filter.hasOwnProperty('outCurrencyId')) {
      query.andWhere(`${alias}.outCurrencyId = :outCurrencyId`, {
        outCurrencyId: filter.outCurrencyId,
      });
    }
    if (filter.hasOwnProperty('type')) {
      query.andWhere(`${alias}.type = :type`, {
        type: filter.type,
      });
    }
    if (filter.hasOwnProperty('status')) {
      query.andWhere(`${alias}.status = :status`, {
        status: filter.status,
      });
    }
    if (filter.hasOwnProperty('paymentMethodId')) {
      query.andWhere(`${alias}.paymentMethodId = :paymentMethodId`, {
        paymentMethodId: filter.paymentMethodId,
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

  async getBalanceHistoryStats(
    userId: string,
    dto: BalanceHistorStatsDTO,
    em?: EntityManager,
  ): Promise<BalanceHistoryStatsResponse> {
    const repository = em
      ? em.getRepository(BalanceHistory)
      : this.entityManager.getRepository(BalanceHistory);

    const alias = 'history';
    const statsInQuery = repository.createQueryBuilder(alias);
    const statsOutQuery = repository.createQueryBuilder(alias);
    const statsFeeQuery = repository.createQueryBuilder(alias);
    statsInQuery.andWhere(`${alias}.userId = :userId`, { userId });
    statsOutQuery.andWhere(`${alias}.userId = :userId`, { userId });
    statsFeeQuery.andWhere(`${alias}.userId = :userId`, { userId });

    statsInQuery.andWhere(`${alias}.inCurrencyId IS NOT NULL`);
    statsOutQuery.andWhere(`${alias}.outCurrencyId IS NOT NULL`);
    statsFeeQuery.andWhere(`${alias}.feeCurrencyId IS NOT NULL`);
    statsInQuery.andWhere(`${alias}.inAmount > 0`);
    statsOutQuery.andWhere(`${alias}.outAmount > 0`);
    statsFeeQuery.andWhere(`${alias}.feeAmount > 0`);

    if (dto.hasOwnProperty('fromDate')) {
      statsInQuery.andWhere(`${alias}.createdAt >= :fromDate`, {
        fromDate: dto.fromDate,
      });
      statsOutQuery.andWhere(`${alias}.createdAt >= :fromDate`, {
        fromDate: dto.fromDate,
      });
      statsFeeQuery.andWhere(`${alias}.createdAt >= :fromDate`, {
        fromDate: dto.fromDate,
      });
    }
    if (dto.hasOwnProperty('toDate')) {
      statsInQuery.andWhere(`${alias}.createdAt <= :toDate`, {
        toDate: dto.toDate,
      });
      statsOutQuery.andWhere(`${alias}.createdAt <= :toDate`, {
        toDate: dto.toDate,
      });
      statsFeeQuery.andWhere(`${alias}.createdAt <= :toDate`, {
        toDate: dto.toDate,
      });
    }
    if (dto.hasOwnProperty('type')) {
      statsInQuery.andWhere(`${alias}.type = :type`, {
        type: dto.type,
      });
      statsOutQuery.andWhere(`${alias}.type = :type`, {
        type: dto.type,
      });
      statsFeeQuery.andWhere(`${alias}.type = :type`, {
        type: dto.type,
      });
    }
    if (dto.hasOwnProperty('status')) {
      statsInQuery.andWhere(`${alias}.status = :status`, {
        status: dto.status,
      });
      statsOutQuery.andWhere(`${alias}.status = :status`, {
        status: dto.status,
      });
      statsFeeQuery.andWhere(`${alias}.status = :status`, {
        status: dto.status,
      });
    }

    //stats in
    statsInQuery
      .select('in_currency_id', 'currencyId')
      .addSelect('count(*)', 'count')
      .addSelect('COALESCE(sum(in_amount), 0)', 'amount')
      .groupBy('in_currency_id');

    //stats out
    statsOutQuery
      .select('out_currency_id', 'currencyId')
      .addSelect('count(*)', 'count')
      .addSelect('COALESCE(sum(out_amount), 0)', 'amount')
      .groupBy('out_currency_id');

    // stats fee
    statsFeeQuery
      .select('fee_currency_id', 'currencyId')
      .addSelect('count(*)', 'count')
      .addSelect('COALESCE(sum(fee_amount), 0)', 'amount')
      .groupBy('fee_currency_id');

    const [statsIn, statsOut, statsFee] = await Promise.all([
      await statsInQuery.getRawMany<BalanceHistoryStatsByCurrency>(),
      await statsOutQuery.getRawMany<BalanceHistoryStatsByCurrency>(),
      await statsFeeQuery.getRawMany<BalanceHistoryStatsByCurrency>(),
    ]);

    const result: BalanceHistoryStatsResponse = {
      statsIn,
      statsOut,
      statsFee,
    };

    return result;
  }
}
