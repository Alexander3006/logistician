import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { S3FileStorageService } from 'src/infrastructure/file/services/s3-file-storage.service';
import { Image } from '../entities/image.entity';
import { Buckets } from 'src/infrastructure/file/types';

@Resolver(() => Image)
export class ImageResolver {
  constructor(private readonly s3FileStorage: S3FileStorageService) {}

  @ResolveField(() => String)
  async url(@Parent() { key }: Image): Promise<string> {
    return await this.s3FileStorage.getSignedFileURI(key, Buckets.IMAGES);
  }
}
