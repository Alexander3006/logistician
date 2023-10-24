import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IFileStorageInterface,
  IUploadFile,
} from '../interfaces/i-file-storage.interface';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import { Buckets } from '../types';
import { URL } from 'url';

@Injectable()
export class S3FileStorageService implements IFileStorageInterface {
  private readonly s3: AWS.S3;
  constructor(private readonly configService: ConfigService) {
    const s3 = new AWS.S3({
      endpoint: this.configService.getOrThrow('AWS_S3_ENDPOINT'),
      s3ForcePathStyle: true,
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow(
          'AWS_S3_SECRET_ACCESS_KEY',
        ),
      },
      signatureVersion: 'v4',
    });
    this.s3 = s3;
  }

  async uploadFile(file: IUploadFile, bucket: Buckets): Promise<string> {
    const key = `${randomUUID()}${file.extension}`;
    const result = await this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: file.stream,
        ContentType: file.mimetipe,
      })
      .promise();
    return key;
  }

  async downloadFile(
    key: string,
    bucket: Buckets,
  ): Promise<NodeJS.ReadableStream> {
    const result = await this.s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    const stream = result.Body;
    return stream as NodeJS.ReadableStream;
  }

  async deleteFile(key: string, bucket: Buckets): Promise<boolean> {
    const result = await this.s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    return true;
  }

  async checkFile(key: string, bucket: Buckets): Promise<boolean> {
    const result = await this.s3
      .headObject({
        Bucket: bucket,
        Key: key,
      })
      .promise()
      .then(
        () => true,
        () => false,
      );
    return result;
  }

  async getSignedFileURI(
    key: string,
    bucket: Buckets,
    ttl: number = 300,
  ): Promise<string> {
    const result = await this.s3.getSignedUrlPromise('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: ttl,
    });
    return result;
  }

  async validateSignedFileURI(
    uri: string,
  ): Promise<{ key: string; bucket: string }> {
    const parsedUrl = new URL(uri);
    const bucket = parsedUrl.host.split('.')[0];
    const key = parsedUrl.pathname.split('/').filter(Boolean)[0];
    return { bucket, key };
  }
}
