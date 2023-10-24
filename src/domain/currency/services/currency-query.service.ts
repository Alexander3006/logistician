import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Currency } from '../entities/currency.entity';

@Injectable()
export class CurrencyQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getCurrency(currencyId: string, em?: EntityManager): Promise<Currency> {
    const repository = em
      ? em.getRepository(Currency)
      : this.entityManager.getRepository(Currency);
    const result = await repository.findOne({ where: { id: currencyId } });
    return result;
  }

  async getCurrencies(em?: EntityManager): Promise<Currency[]> {
    const repository = em
      ? em.getRepository(Currency)
      : this.entityManager.getRepository(Currency);
    const result = await repository.find();
    return result;
  }
}
