import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CargoType } from '../entities/cargo-type.entity';
import { CreateCargoTypeDTO } from '../dto/create-cargo-type.dto';

@Injectable()
export class CargoTypeCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createCargoType(
    payload: CreateCargoTypeDTO,
    em?: EntityManager,
  ): Promise<CargoType> {
    const repository = em
      ? em.getRepository(CargoType)
      : this.entityManager.getRepository(CargoType);
    const entity = CargoType.create({ ...payload });
    const cargoType = await repository.save(entity);
    return cargoType;
  }

  async deleteCargoType(
    cargoTypeId: string,
    em?: EntityManager,
  ): Promise<boolean> {
    const repository = em
      ? em.getRepository(CargoType)
      : this.entityManager.getRepository(CargoType);
    await repository.delete({ id: cargoTypeId });
    return true;
  }
}
