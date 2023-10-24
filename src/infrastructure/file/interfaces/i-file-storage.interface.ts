import { Buckets } from '../types';

export interface IUploadFile {
  stream: NodeJS.ReadableStream;
  mimetipe: string;
  extension: string;
}

export interface IFileStorageInterface {
  uploadFile(file: IUploadFile, bucket: Buckets): Promise<string>;
  downloadFile(key: string, bucket: Buckets): Promise<NodeJS.ReadableStream>;
  checkFile(key: string, bucket: Buckets): Promise<boolean>;
  getSignedFileURI(key: string, bucket: Buckets, ttl?: number): Promise<string>;
  validateSignedFileURI(
    uri: string,
  ): Promise<{ key: string; bucket: string } | null>;
  deleteFile(key: string, bucket: Buckets): Promise<boolean>;
}
