import { Module } from '@nestjs/common';
import { ImageQueryService } from './services/image-query.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { FileModule } from 'src/infrastructure/file/file.module';
import { ImageResolver } from './resolvers/image.resolver';
import { ImageCommandService } from './services/image-command.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), FileModule],
  providers: [
    //resolvers
    ImageResolver,
    //services
    ImageQueryService,
    ImageCommandService,
  ],
  exports: [ImageQueryService, ImageCommandService],
})
export class ImageModule {}
