import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Document } from '../entities/document.entity';
import { S3FileStorageService } from 'src/infrastructure/file/services/s3-file-storage.service';
import { Buckets } from 'src/infrastructure/file/types';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly s3FileStorage: S3FileStorageService) {}

  @ResolveField(() => String)
  async url(@Parent() { key }: Document): Promise<string> {
    return await this.s3FileStorage.getSignedFileURI(key, Buckets.DOCS);
  }
}
