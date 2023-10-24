import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Image } from '../entities/image.entity';
import { ImageOwner, ImageOwnerMap } from '../types';

@Injectable()
export class ImageQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getImagesByOwner(
    ownerId: string,
    owner: ImageOwner,
    limit: number = Number.MAX_SAFE_INTEGER,
    em?: EntityManager,
  ): Promise<Image[]> {
    const repository = em
      ? em.getRepository(Image)
      : this.entityManager.getRepository(Image);
    const images = await repository.find({
      where: {
        [ImageOwnerMap[owner]]: ownerId,
      },
      order: {
        createdAt: {
          direction: 'DESC',
        },
      },
      take: limit ?? Number.MAX_SAFE_INTEGER,
    });
    return images;
  }
}
