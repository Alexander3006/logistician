import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { EntityManager } from 'typeorm';
import { Car } from '../entities/car.entity';
import { CarFilterDTO } from '../dto/car-filter.dto';
import { Document } from 'src/domain/documents/entities/document.entity';
import { AppException } from 'src/common/exceptions';
import { DocumentQueryService } from 'src/domain/documents/services/document-query.service';
import { DocumentOwner } from 'src/domain/documents/types';

export class CarQueryServiceException extends AppException {}

@Injectable()
export class CarQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly documentQueryService: DocumentQueryService,
  ) {}

  async getCar(carId: string, em?: EntityManager): Promise<Car> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    const car = await repository.findOne({ where: { id: carId } });
    return car;
  }

  async getFilteredCars(
    payload: CarFilterDTO,
    em?: EntityManager,
  ): Promise<IPaginatedDTO<Car>> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    const { sort, pagination, filter } = payload;
    const alias = 'car';
    const query = repository.createQueryBuilder(alias);

    if ('ownerId' in filter) {
      query.andWhere(`${alias}.ownerId = :ownerId`, {
        ownerId: filter.ownerId,
      });
    }
    if ('driverId' in filter) {
      query.andWhere(`${alias}.driverId = :driverId`, {
        driverId: filter.driverId,
      });
    }
    if ('typeId' in filter) {
      query.andWhere(`${alias}.typeId = :typeId`, { typeId: filter.typeId });
    }
    if ('minLoadCapacity' in filter) {
      query.andWhere(`${alias}.loadCapacity >= :minLoadCapacity`, {
        minLoadCapacity: filter.minLoadCapacity,
      });
    }
    if ('maxLoadCapacity' in filter) {
      query.andWhere(`${alias}.loadCapacity <= :maxLoadCapacity`, {
        maxLoadCapacity: filter.maxLoadCapacity,
      });
    }
    if ('minVolume' in filter) {
      query.andWhere(`${alias}.volume >= :minVolume`, {
        minVolume: filter.minVolume,
      });
    }
    if ('maxVolume' in filter) {
      query.andWhere(`${alias}.volume <= :maxVolume`, {
        maxVolume: filter.maxVolume,
      });
    }
    if ('verified' in filter) {
      query.andWhere(`${alias}.verified = :verified`, {
        verified: filter.verified,
      });
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

  async getCarByOwner(
    userId: string,
    carId: string,
    em?: EntityManager,
  ): Promise<Car> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    const car = await repository.findOne({
      where: {
        id: carId,
        ownerId: userId,
      },
    });
    return car;
  }

  async getCarDocuments(
    carId: string,
    em?: EntityManager,
  ): Promise<Document[]> {
    const documents = await this.documentQueryService.getDocumentsByOwner(
      carId,
      DocumentOwner.CAR,
      Number.MAX_SAFE_INTEGER,
      em,
    );
    return documents;
  }
}
