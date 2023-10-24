import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { BalancePayment } from '../entities/balance-payment.entity';

@Injectable()
export class BalancePaymentQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getBalancePayment(
    filter: FindOptionsWhere<BalancePayment>,
    em?: EntityManager,
  ): Promise<BalancePayment> {
    const repository = em
      ? em.getRepository(BalancePayment)
      : this.entityManager.getRepository(BalancePayment);
    const entity = await repository.findOne({ where: filter });
    return entity;
  }
}
