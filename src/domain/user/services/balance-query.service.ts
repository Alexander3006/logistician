import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserBalance } from '../../user/entities/user-balance.entity';

@Injectable()
export class UserBalanceQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getBalances(
    userId: string,
    em?: EntityManager,
  ): Promise<UserBalance[]> {
    const repository = em
      ? em.getRepository(UserBalance)
      : this.entityManager.getRepository(UserBalance);
    const balances = await repository.find({
      where: {
        userId,
      },
    });
    return balances;
  }
}
