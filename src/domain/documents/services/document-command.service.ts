import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { S3FileStorageService } from 'src/infrastructure/file/services/s3-file-storage.service';
import { EntityManager } from 'typeorm';
import { Document, DocumentType } from '../entities/document.entity';
import { DocumentOwner, DocumentOwnerMap } from '../types';
import { IUploadFile } from 'src/infrastructure/file/interfaces/i-file-storage.interface';
import { Buckets } from 'src/infrastructure/file/types';

@Injectable()
export class DocumentCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly s3FileStorageService: S3FileStorageService,
  ) {}

  async saveDocument(
    type: DocumentType,
    ownerId: string,
    owner: DocumentOwner,
    file: IUploadFile,
    em: EntityManager,
  ): Promise<Document> {
    const repository = em.getRepository(Document);
    const key = await this.s3FileStorageService.uploadFile(
      {
        ...file,
        extension: file.extension,
        stream: file.stream,
      },
      Buckets.DOCS,
    );
    const entity = Document.create({
      type: type,
      [DocumentOwnerMap[owner]]: ownerId,
      mimetype: file.mimetipe,
      key: key,
    });
    const document = await repository.save(entity);
    return document;
  }
}
