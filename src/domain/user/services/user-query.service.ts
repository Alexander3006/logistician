import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOptionsWhere, EntityManager } from 'typeorm';
import { IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { UserFilterDTO } from '../dto/user-filter.dto';

@Injectable()
export class UserQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getUser(
    filter: FindOptionsWhere<User>,
    em?: EntityManager,
  ): Promise<User> {
    const repository = em
      ? em.getRepository(User)
      : this.entityManager.getRepository(User);
    const user = await repository.findOne({ where: filter });
    return user;
  }

  async getFilteredUsers(
    payload: UserFilterDTO,
    em?: EntityManager,
  ): Promise<IPaginatedDTO<User>> {
    const repository = em
      ? em.getRepository(User)
      : this.entityManager.getRepository(User);
    const { sort, pagination, filter } = payload;
    const alias = 'user';
    const query = repository.createQueryBuilder(alias);

    if ('name' in filter) {
      query.andWhere(`${alias}.name ILIKE :name`, { name: `%${filter.name}%` });
    }
    if ('lastname' in filter) {
      query.andWhere(`${alias}.lastname ILIKE :lastname`, {
        lastname: `%${filter.lastname}%`,
      });
    }
    if ('nickname' in filter) {
      query.andWhere(`${alias}.nickname ILIKE :nickname`, {
        nickname: `%${filter.nickname}%`,
      });
    }
    if ('email' in filter) {
      query.andWhere(`${alias}.email = :email`, { email: filter.email });
    }
    if ('role' in filter) {
      query.andWhere(`${alias}.role = :role`, { role: filter.role });
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
