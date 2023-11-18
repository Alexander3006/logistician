import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  Location,
  LocationOwner,
  LocationOwnerMap,
} from '../entities/location.entity';

@Injectable()
export class LocationQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getLocationByOwner(
    ownerId: string,
    owner: LocationOwner,
    em?: EntityManager,
    limit: number = Number.MAX_SAFE_INTEGER,
  ): Promise<Location[]> {
    const repository = em
      ? em.getRepository(Location)
      : this.entityManager.getRepository(Location);

    const location = await repository.find({
      where: {
        [LocationOwnerMap[owner]]: ownerId,
      },
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
      take: limit,
    });
    return location;
  }
}
