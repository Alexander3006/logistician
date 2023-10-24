import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { DocumentOwner, DocumentOwnerMap } from '../types';
import { Document } from '../entities/document.entity';

@Injectable()
export class DocumentQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getDocumentsByOwner(
    ownerId: string,
    owner: DocumentOwner,
    limit: number = Number.MAX_SAFE_INTEGER,
    em?: EntityManager,
  ): Promise<Document[]> {
    const repository = em
      ? em.getRepository(Document)
      : this.entityManager.getRepository(Document);
    const documents = await repository.find({
      where: {
        [DocumentOwnerMap[owner]]: ownerId,
      },
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
      take: limit ?? Number.MAX_SAFE_INTEGER,
    });
    return documents;
  }
}
