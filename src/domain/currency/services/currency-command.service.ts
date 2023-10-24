import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Currency } from '../entities/currency.entity';
import { CreateCurrencyDTO } from '../dto/create-currency.dto';
import { UpdateCurrencyDTO } from '../dto/update-currency.dto';

@Injectable()
export class CurrencyCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createCurrency(
    payload: CreateCurrencyDTO,
    em?: EntityManager,
  ): Promise<Currency> {
    const repository = em
      ? em.getRepository(Currency)
      : this.entityManager.getRepository(Currency);
    const entity = Currency.create({ ...payload });
    const currency = await repository.save(entity);
    return currency;
  }

  async updateCurrency(
    payload: UpdateCurrencyDTO,
    em?: EntityManager,
  ): Promise<Currency> {
    const repository = em
      ? em.getRepository(Currency)
      : this.entityManager.getRepository(Currency);
    await repository.update({ id: payload.id }, payload);
    const currency = await repository.findOne({ where: { id: payload.id } });
    return currency;
  }
}
