import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  Address,
  AddressOwner,
  AddressOwnerMap,
} from '../entities/addess.entity';
import { AddressInputDTO } from '../dto/address.dto';

@Injectable()
export class AddressCommandService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async saveAddress(
    ownerId: string,
    owner: AddressOwner,
    address: AddressInputDTO,
    em: EntityManager,
  ): Promise<Address> {
    const repository = em.getRepository(Address);
    const entity = Address.create({
      ...address,
      [AddressOwnerMap[owner]]: ownerId,
    });
    const saved = await repository.save(entity);
    return saved;
  }
}
