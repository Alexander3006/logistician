import { Injectable } from '@nestjs/common';
import {
  IFileStorageInterface,
  IUploadFile,
} from '../interfaces/i-file-storage.interface';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { join } from 'path';
import * as fsp from 'fs/promises';
import * as fs from 'fs';
import { Buckets } from '../types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalFileStorageService implements IFileStorageInterface {
  private readonly basepath: string;
  private readonly secret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.basepath = this.configService.getOrThrow(
      'LOCAL_FILE_STORAGE_BASE_PATH',
    );
    this.secret = this.configService.getOrThrow('LOCAL_FILE_SIGN_URL_KEY');
  }

  async uploadFile(file: IUploadFile, bucket: Buckets): Promise<string> {
    const key = `${randomUUID()}${file.extension}`;
    const path = join(this.basepath, bucket, key);
    await fsp.writeFile(path, file.stream, 'utf-8');
    return key;
  }

  async downloadFile(
    key: string,
    bucket: Buckets,
  ): Promise<NodeJS.ReadableStream> {
    const path = join(this.basepath, bucket, key);
    const stream = fs.createReadStream(path, 'utf-8');
    return stream;
  }

  async checkFile(key: string, bucket: Buckets): Promise<boolean> {
    const path = join(this.basepath, bucket, key);
    const result = await fsp.stat(path).then(
      () => true,
      () => false,
    );
    return result;
  }

  async deleteFile(key: string, bucket: Buckets): Promise<boolean> {
    const path = join(this.basepath, bucket, key);
    const result = await fsp.rm(path);
    return true;
  }

  async getSignedFileURI(
    key: string,
    bucket: Buckets,
    ttl?: number,
  ): Promise<string> {
    const data = {
      key,
      bucket,
    };
    const signed = await this.jwtService.signAsync(data, {
      secret: this.secret,
      expiresIn: ttl,
    });
    return signed;
  }

  async validateSignedFileURI(
    uri: string,
  ): Promise<{ key: string; bucket: string }> {
    const data = await this.jwtService.verifyAsync(uri, {
      secret: this.secret,
    });
    return data;
  }
}
