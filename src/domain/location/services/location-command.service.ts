import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  LocationOwner,
  Location,
  LocationOwnerMap,
} from '../entities/location.entity';
import { PointDTO, PointInputDTO } from '../dto/point.dto';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class LocationCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async saveLocation(
    ownerId: string,
    owner: LocationOwner,
    location: PointInputDTO,
    em: EntityManager,
  ): Promise<Location> {
    const repository = em.getRepository(Location);
    const entity = Location.create({
      [LocationOwnerMap[owner]]: ownerId,
      _coordinates: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      description: location.description,
    });
    const query = repository
      .createQueryBuilder()
      .insert()
      .into(Location)
      .values(entity)
      .orUpdate(
        ['coordinates'],
        [new SnakeNamingStrategy().columnName(LocationOwnerMap[owner], '', [])],
      );
    await query.execute();
    return await repository.findOneOrFail({
      where: {
        [LocationOwnerMap[owner]]: ownerId,
      },
    });
  }
}
