import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserCommandService } from '../services/user-command.service';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { RegisterUserInput } from '../dto/register-user.input';
import { RateLimiterRegisterUser } from '../guards/rate-limiter.guard';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Stream } from 'stream';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { Image } from 'src/domain/images/entities/image.entity';
import { ImageCommandService } from 'src/domain/images/services/image-command.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ImageOwner } from 'src/domain/images/types';
import * as path from 'path';
import {
  Document,
  DocumentType,
} from 'src/domain/documents/entities/document.entity';
import { DocumentCommandService } from 'src/domain/documents/services/document-command.service';
import { DocumentOwner } from 'src/domain/documents/types';
import { Location } from 'src/domain/location/entities/location.entity';
import { PointInputDTO } from 'src/domain/location/dto/point.dto';

@Resolver(() => User)
export class UserCommandResolver {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userCommandService: UserCommandService,
    private readonly imageCommandService: ImageCommandService,
    private readonly documentCommandService: DocumentCommandService,
  ) {}

  @UseGuards(RateLimiterRegisterUser)
  @Mutation(() => User, { name: 'registerUser' })
  async registerUser(
    @Args(
      'credentials',
      new ValidationPipe({ whitelist: true, transform: true }),
    )
    credentials: RegisterUserInput,
  ): Promise<User> {
    console.log(credentials);
    return await this.userCommandService.register(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Image)
  async uploadUserPhoto(
    @Args('photo', { type: () => GraphQLUpload })
    file: {
      filename: string;
      mimetype: string;
      encoding: string;
      createReadStream: () => Stream;
    },
    @AuthUser() user: User,
  ): Promise<Image> {
    const userId = user.id;
    // const userId = 'c6b696e4-701b-4a29-940c-50c4e46bda62'; //test
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const image = await this.imageCommandService.saveImage(
        userId,
        ImageOwner.USER,
        {
          mimetipe: file.mimetype,
          extension: path.extname(file.filename).toLowerCase(),
          stream: file.createReadStream() as NodeJS.ReadableStream,
        },
        em,
      );
      return image;
    });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async uploadUserDocument(
    @Args('documentType') documentType: DocumentType,
    @Args('file', { type: () => GraphQLUpload })
    file: {
      filename: string;
      mimetype: string;
      encoding: string;
      createReadStream: () => Stream;
    },
    @AuthUser() user: User,
  ): Promise<Document> {
    const userId = user.id;
    // const userId = 'c6b696e4-701b-4a29-940c-50c4e46bda62'; //test
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const document = await this.documentCommandService.saveDocument(
        documentType,
        userId,
        DocumentOwner.USER,
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Location)
  async updateUserLocation(
    @AuthUser() user: User,
    @Args('payload') payload: PointInputDTO,
  ): Promise<Location> {
    const result = await this.userCommandService.updateUserLocation(
      user.id,
      payload,
    );
    return result;
  }
}
