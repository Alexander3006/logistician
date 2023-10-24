import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ImageFileService } from 'src/infrastructure/file/services/image-file.service';
import { S3FileStorageService } from 'src/infrastructure/file/services/s3-file-storage.service';
import { EntityManager } from 'typeorm';
import { ImageOwner, ImageOwnerMap } from '../types';
import { Image } from '../entities/image.entity';
import { IUploadFile } from 'src/infrastructure/file/interfaces/i-file-storage.interface';
import { Buckets } from 'src/infrastructure/file/types';

@Injectable()
export class ImageCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly imageFileService: ImageFileService,
    private readonly s3FileStorageService: S3FileStorageService,
  ) {}

  async saveImage(
    ownerId: string,
    owner: ImageOwner,
    file: IUploadFile,
    em: EntityManager,
  ): Promise<Image> {
    const repository = em.getRepository(Image);
    const compressed = await this.imageFileService.compressImageFile(
      file.mimetipe,
      file.stream,
      [ImageOwner.USER].includes(owner) ? 1280 : undefined,
    );
    const key = await this.s3FileStorageService.uploadFile(
      {
        ...file,
        extension: 'jpg',
        stream: compressed,
      },
      Buckets.IMAGES,
    );
    const entity = Image.create({
      [ImageOwnerMap[owner]]: ownerId,
      mimetype: file.mimetipe,
      key: key,
    });
    const image = await repository.save(entity);
    return image;
  }
}
