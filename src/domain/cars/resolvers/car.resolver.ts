import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Car } from '../entities/car.entity';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { User } from 'src/domain/user/entities/user.entity';
import { CargoTypeQueryService } from '../services/cargo-type-query.service';
import { CargoType } from '../entities/cargo-type.entity';
import { ImageQueryService } from 'src/domain/images/services/image-query.service';
import { Image } from 'src/domain/images/entities/image.entity';
import { ImageOwner } from 'src/domain/images/types';
import {
  Location,
  LocationOwner,
} from 'src/domain/location/entities/location.entity';
import { LocationQueryService } from 'src/domain/location/services/location-query.service';

@Resolver(() => Car)
export class CarResolver {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly cargoTypeQueryService: CargoTypeQueryService,
    private readonly imageQueryService: ImageQueryService,
    private readonly locationQueryService: LocationQueryService,
  ) {}

  @ResolveField(() => User)
  async owner(@Parent() { ownerId }: Car): Promise<User> {
    return await this.userQueryService.getUser({ id: ownerId });
  }

  @ResolveField(() => User, { nullable: true })
  async driver(@Parent() { ownerId }: Car): Promise<User> {
    return await this.userQueryService.getUser({ id: ownerId });
  }

  @ResolveField(() => CargoType)
  async type(@Parent() { typeId }: Car): Promise<CargoType> {
    return await this.cargoTypeQueryService.getCargoType(typeId);
  }

  @ResolveField(() => [Image])
  async photos(@Parent() { id }: Car): Promise<Image[]> {
    return await this.imageQueryService.getImagesByOwner(id, ImageOwner.CAR);
  }

  @ResolveField(() => [Location])
  async locations(@Parent() { id }: User): Promise<Location[]> {
    const locations = await this.locationQueryService.getLocationByOwner(
      id,
      LocationOwner.CAR,
      undefined,
      1,
    );
    return locations;
  }
}
