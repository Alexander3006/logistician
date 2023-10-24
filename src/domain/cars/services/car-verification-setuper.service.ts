import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IVerificationSetuper } from 'src/domain/verification/interfaces/verification-setuper.interface';
import { EntityManager } from 'typeorm';
import { CarQueryService } from './car-query.service';
import { Car } from '../entities/car.entity';

@Injectable()
export class CarVerificationSetuperService implements IVerificationSetuper {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly carQueryService: CarQueryService,
  ) {}

  // interface impl
  async setVerifiedStatus(
    carId: string,
    status: boolean,
    em?: EntityManager,
  ): Promise<boolean> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    await repository.update({ id: carId }, { verified: status });
    return true;
  }

  // interface impl
  async checkAccess(
    id: string,
    userId: string,
    em?: EntityManager,
  ): Promise<boolean> {
    const car = await this.carQueryService.getCarByOwner(userId, id);
    return !!car;
  }
}
