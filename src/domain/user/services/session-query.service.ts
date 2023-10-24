import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from '../entities/session.entity';
import { EntityManager, Repository } from 'typeorm';

export class SessionQueryServiceError extends Error {}

@Injectable()
export class SessionQueryService {
  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
  ) {}

  async getSession(id: string, em?: EntityManager): Promise<UserSession> {
    const repository = em?.getRepository(UserSession) ?? this.sessionRepository;
    const session = await repository.findOne({
      where: { id },
      relations: ['user'],
    });
    return session;
  }
}
