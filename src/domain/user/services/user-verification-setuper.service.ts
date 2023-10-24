import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IVerificationSetuper } from 'src/domain/verification/interfaces/verification-setuper.interface';
import { User } from '../entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserVerificationSetuperService implements IVerificationSetuper {
  constructor(
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>,
  ) {}

  // interface impl
  async setVerifiedStatus(
    userId: string,
    status: boolean,
    em?: EntityManager,
  ): Promise<boolean> {
    const repository = em ? em.getRepository(User) : this.userRepositoty;
    await repository.update({ id: userId }, { verified: status });
    return true;
  }

  // interface impl
  async checkAccess(
    id: string,
    userId: string,
    em?: EntityManager,
  ): Promise<boolean> {
    return id === userId;
  }
}
