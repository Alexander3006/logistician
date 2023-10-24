import { Module } from '@nestjs/common';
import { S3FileStorageService } from './services/s3-file-storage.service';
import { ImageFileService } from './services/image-file.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalFileStorageService } from './services/local-file-storage.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
      }),
    }),
  ],
  providers: [S3FileStorageService, LocalFileStorageService, ImageFileService],
  exports: [S3FileStorageService, LocalFileStorageService, ImageFileService],
})
export class FileModule {}
