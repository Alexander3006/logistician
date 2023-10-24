import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from '../entities/session.entity';
import { EntityManager, Repository } from 'typeorm';

export class SessionCommandServiceError extends Error {}

@Injectable()
export class SessionCommandService {
  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
  ) {}

  async createSession(
    payload: {
      id: string;
      userId: string;
      accessToken: string;
      refreshToken: string;
      ip: string;
      device: string;
    },
    em?: EntityManager,
  ): Promise<UserSession> {
    const repository = em?.getRepository(UserSession) ?? this.sessionRepository;
    const session = UserSession.create({
      id: payload.id,
      userId: payload.userId,
      device: payload.device,
      ip: payload.ip,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      active: true,
    });
    return await repository.save(session);
  }

  async disableSession(id: string, em?: EntityManager) {
    const repository = em?.getRepository(UserSession) ?? this.sessionRepository;
    await repository.update({ id }, { active: false });
  }

  async refreshSession(
    payload: {
      id: string;
      accessToken: string;
      refreshToken: string;
      ip: string;
      device: string;
    },
    em?: EntityManager,
  ) {
    const repository = em?.getRepository(UserSession) ?? this.sessionRepository;
    await repository.update(
      { id: payload.id, active: true },
      {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        ip: payload.ip,
        device: payload.device,
      },
    );
    return;
  }
}
