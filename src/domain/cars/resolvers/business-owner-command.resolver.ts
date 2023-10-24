import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Car } from '../entities/car.entity';
import { CarCommandService } from '../services/car-command.service';
import { UseGuards } from '@nestjs/common';
import { CreateCarDTO } from '../dto/create-car.dto';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User, UserRoles } from 'src/domain/user/entities/user.entity';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { UpdateCarDTO } from '../dto/update-car.dto';
import { Stream } from 'stream';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Document } from 'src/domain/documents/entities/document.entity';
import { CarUploadDocumentDTO } from '../dto/upload-document.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as path from 'path';
import { Image } from 'src/domain/images/entities/image.entity';

@Resolver(() => Car)
@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRoles.BUSINESS_OWNER)
export class BusinessOwnerCommandResolver {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly carCommandService: CarCommandService,
  ) {}

  @Mutation(() => Car)
  async createCar(
    @AuthUser() user: User,
    @Args('payload') payload: CreateCarDTO,
  ): Promise<Car> {
    const result = await this.carCommandService.createCar(user.id, payload);
    return result;
  }

  @Mutation(() => Car)
  async updateCar(
    @AuthUser() user: User,
    @Args('payload') payload: UpdateCarDTO,
  ): Promise<Car> {
    const result = await this.carCommandService.updateCar(user.id, payload);
    return result;
  }

  @Mutation(() => Boolean)
  async deleteCar(
    @AuthUser() user: User,
    @Args('carId') carId: string,
  ): Promise<boolean> {
    const result = await this.carCommandService.deleteCar(user.id, carId);
    return result;
  }

  @Mutation(() => Document)
  async uploadCarDocument(
    @Args('payload') dto: CarUploadDocumentDTO,
    @Args('file', { type: () => GraphQLUpload })
    file: {
      filename: string;
      mimetype: string;
      encoding: string;
      createReadStream: () => Stream;
    },
    @AuthUser() user: User,
  ): Promise<Document> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const document = await this.carCommandService.uploadDocument(
        user.id,
        dto,
        {
          mimetipe: file.mimetype,
          extension: path.extname(file.filename).toLowerCase(),
          stream: file.createReadStream() as NodeJS.ReadableStream,
        },
        em,
      );
      return document;
    });
  }

  @Mutation(() => Image)
  async uploadCarPhoto(
    @Args('carId') carId: string,
    @Args('file', { type: () => GraphQLUpload })
    file: {
      filename: string;
      mimetype: string;
      encoding: string;
      createReadStream: () => Stream;
    },
    @AuthUser() user: User,
  ): Promise<Image> {
    return await this.entityManager.transaction(async (em) => {
      return await this.carCommandService.uploadCarPhoto(
        user.id,
        carId,
        {
          mimetipe: file.mimetype,
          extension: path.extname(file.filename).toLowerCase(),
          stream: file.createReadStream() as NodeJS.ReadableStream,
        },
        em,
      );
    });
  }
}
