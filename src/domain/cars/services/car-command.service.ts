import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Car } from '../entities/car.entity';
import { CreateCarDTO } from '../dto/create-car.dto';
import { UpdateCarDTO } from '../dto/update-car.dto';
import { CarUploadDocumentDTO } from '../dto/upload-document.dto';
import { IUploadFile } from 'src/infrastructure/file/interfaces/i-file-storage.interface';
import { DocumentCommandService } from 'src/domain/documents/services/document-command.service';
import { AppException } from 'src/common/exceptions';
import { DocumentOwner } from 'src/domain/documents/types';
import { Document } from 'src/domain/documents/entities/document.entity';
import { CarQueryService } from './car-query.service';
import { Image } from 'src/domain/images/entities/image.entity';
import { ImageCommandService } from 'src/domain/images/services/image-command.service';
import { ImageOwner } from 'src/domain/images/types';
import { PointDTO } from 'src/domain/location/dto/point.dto';
import {
  Location,
  LocationOwner,
} from 'src/domain/location/entities/location.entity';
import { LocationCommandService } from 'src/domain/location/services/location-command.service';

export class CarCommandServiceException extends AppException {}

@Injectable()
export class CarCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly documentCommandService: DocumentCommandService,
    private readonly carQueryService: CarQueryService,
    private readonly imageCommandService: ImageCommandService,
    private readonly locationCommandService: LocationCommandService,
  ) {}

  async createCar(
    ownerId: string,
    payload: CreateCarDTO,
    em?: EntityManager,
  ): Promise<Car> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    const entity = Car.create({
      ...payload,
      ownerId: ownerId,
    });
    const car = await repository.save(entity);
    return car;
  }

  async updateCar(
    ownerId: string,
    payload: UpdateCarDTO,
    em?: EntityManager,
  ): Promise<Car> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    await repository.update({ id: payload.id, ownerId: ownerId }, payload);
    return repository.findOne({ where: { id: payload.id } });
  }

  async deleteCar(
    ownerId: string,
    id: string,
    em?: EntityManager,
  ): Promise<boolean> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    await repository.softDelete({ id, ownerId });
    return true;
  }

  async uploadDocument(
    userId: string,
    dto: CarUploadDocumentDTO,
    file: IUploadFile,
    em: EntityManager,
  ): Promise<Document> {
    const car = await this.carQueryService.getCarByOwner(userId, dto.carId, em);
    if (!car)
      throw new CarCommandServiceException({
        message: `Car with owner ${userId} and id ${dto.carId} not found`,
        code: 'CAR_NOT_FOUND',
        statusCode: 404,
      });
    const document = await this.documentCommandService.saveDocument(
      dto.documentType,
      dto.carId,
      DocumentOwner.CAR,
      file,
      em,
    );
    return document;
  }

  async uploadCarPhoto(
    userId: string,
    carId: string,
    file: IUploadFile,
    em: EntityManager,
  ): Promise<Image> {
    const car = await this.carQueryService.getCarByOwner(userId, carId, em);
    if (!car)
      throw new CarCommandServiceException({
        message: `Car with owner ${userId} and id ${carId} not found`,
        code: 'CAR_NOT_FOUND',
        statusCode: 404,
      });
    const image = await this.imageCommandService.saveImage(
      carId,
      ImageOwner.CAR,
      file,
      em,
    );
    return image;
  }

  async updateCarLocation(
    userId: string,
    carId: string,
    point: PointDTO,
    em?: EntityManager,
  ): Promise<Location> {
    const repository = em
      ? em.getRepository(Car)
      : this.entityManager.getRepository(Car);
    await repository.findOneOrFail({
      where: {
        id: carId,
        driverId: userId,
      },
    });
    const location = await this.locationCommandService.saveLocation(
      userId,
      LocationOwner.CAR,
      point,
      em,
    );
    return location;
  }
}
