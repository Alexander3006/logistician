import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  Address,
  AddressOwner,
  AddressOwnerMap,
} from '../entities/addess.entity';
import { AddressFilterOptions } from '../dto/address-filter.dto';

@Injectable()
export class AddressQueryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getAddressByOwner(
    ownerId: string,
    owner: AddressOwner,
    filter?: AddressFilterOptions,
    em?: EntityManager,
    limit: number = Number.MAX_SAFE_INTEGER,
  ): Promise<Address[]> {
    const repository = em
      ? em.getRepository(Address)
      : this.entityManager.getRepository(Address);

    const alias = 'user';
    const query = repository.createQueryBuilder(alias);
    const ownerField = AddressOwnerMap[owner];
    query.andWhere(`${alias}.${ownerField} = :owner`, { owner: ownerId });

    if ('country' in filter) {
      query.andWhere(`${alias}.country = :country`, {
        country: filter.country,
      });
    }
    if ('region' in filter) {
      query.andWhere(`${alias}.region = :region`, { region: filter.region });
    }
    if ('city' in filter) {
      query.andWhere(`${alias}.city = :city`, { city: filter.city });
    }
    if ('address' in filter) {
      query.andWhere(`${alias}.address = :address`, {
        address: filter.address,
      });
    }
    if ('description' in filter) {
      query.andWhere(`${alias}.description = :description`, {
        description: filter.description,
      });
    }

    query.orderBy(`${alias}.createdAt`, 'DESC');
    query.take(limit);

    const addresses = await query.getMany();
    return addresses;
  }
}
