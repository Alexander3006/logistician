import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Verification } from '../entities/verification.entity';
import { IVerificationSetuper } from '../interfaces/verification-setuper.interface';
import { CreateVerificationDTO } from '../dto/create-verification.dto';
import {
  VerificationStatus,
  VerificationTargetType,
  VerificationTargetTypeMap,
} from '../types';
import { UpdateVerificationDTO } from '../dto/update-verification.dto';
import { AppException } from 'src/common/exceptions';
import { UserVerificationSetuperService } from 'src/domain/user/services/user-verification-setuper.service';
import { CarVerificationSetuperService } from 'src/domain/cars/services/car-verification-setuper.service';

export class VerificationCommandServiceException extends AppException {}

@Injectable()
export class VerificationCommandService {
  private readonly setupers: Record<
    VerificationTargetType,
    IVerificationSetuper
  >;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    carService: CarVerificationSetuperService,
    userService: UserVerificationSetuperService,
  ) {
    this.setupers = {
      [VerificationTargetType.CAR]: carService,
      [VerificationTargetType.USER]: userService,
    };
  }

  async createVerification(
    userId: string,
    dto: CreateVerificationDTO,
    em?: EntityManager,
  ): Promise<Verification> {
    const repository = em
      ? em.getRepository(Verification)
      : this.entityManager.getRepository(Verification);
    const access = await this.setupers[dto.type].checkAccess(
      dto.targetId,
      userId,
      em,
    );
    if (!access)
      throw new VerificationCommandServiceException({
        message: `The target does not belong to you`,
        code: 'FORBIDDEN',
        statusCode: 403,
      });
    const entity = Verification.create({
      status: VerificationStatus.PENDING,
      description: dto.description,
      type: dto.type,
      [VerificationTargetTypeMap[dto.type]]: dto.targetId,
      ownerId: userId,
    });
    const verification = await repository.save(entity);
    return verification;
  }

  async approveVerification(
    dto: UpdateVerificationDTO,
    em: EntityManager,
  ): Promise<Verification> {
    const repository = em.getRepository(Verification);
    await repository.update(
      { id: dto.id },
      { status: VerificationStatus.APPROVED, response: dto.response },
    );
    const verification = await repository.findOneOrFail({
      where: { id: dto.id },
    });
    await this.setupers[verification.type].setVerifiedStatus(
      verification[VerificationTargetTypeMap[verification.type]],
      true,
      em,
    );
    return verification;
  }

  async rejectVerification(
    dto: UpdateVerificationDTO,
    em: EntityManager,
  ): Promise<Verification> {
    const repository = em.getRepository(Verification);
    await repository.update(
      { id: dto.id },
      { status: VerificationStatus.REJECTED, response: dto.response },
    );
    const verification = await repository.findOneOrFail({
      where: { id: dto.id },
    });
    return verification;
  }
}
