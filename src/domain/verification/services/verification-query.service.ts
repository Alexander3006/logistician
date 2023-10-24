import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { VerificationFilterDTO } from '../dto/verification-filter.dto';
import { IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { Verification } from '../entities/verification.entity';

@Injectable()
export class VerificationQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getFilteredVerifications(
    dto: VerificationFilterDTO,
    em?: EntityManager,
  ): Promise<IPaginatedDTO<Verification>> {
    const repository = em
      ? em.getRepository(Verification)
      : this.entityManager.getRepository(Verification);
    const { sort, pagination, filter } = dto;
    const alias = 'verification';
    const query = repository.createQueryBuilder(alias);

    if ('status' in filter) {
      query.andWhere(`${alias}.status = :status`, { status: filter.status });
    }
    if ('type' in filter) {
      query.andWhere(`${alias}.type = :type`, { type: filter.type });
    }
    if ('ownerId' in filter) {
      query.andWhere(`${alias}.ownerId = :ownerId`, {
        ownerId: filter.ownerId,
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
