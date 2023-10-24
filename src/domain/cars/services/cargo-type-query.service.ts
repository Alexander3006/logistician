import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CargoType } from '../entities/cargo-type.entity';

@Injectable()
export class CargoTypeQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getCargoType(id: string, em?: EntityManager): Promise<CargoType> {
    const repository = em
      ? em.getRepository(CargoType)
      : this.entityManager.getRepository(CargoType);
    const cargoType = await repository.findOne({ where: { id } });
    return cargoType;
  }

  async getCargoTypes(em?: EntityManager): Promise<CargoType[]> {
    const repository = em
      ? em.getRepository(CargoType)
      : this.entityManager.getRepository(CargoType);
    const result = await repository.find();
    return result;
  }
}
