import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserBalanceQueryService } from '../services/balance-query.service';
import { UserBalance } from '../entities/user-balance.entity';
import { Image } from 'src/domain/images/entities/image.entity';
import { ImageQueryService } from 'src/domain/images/services/image-query.service';
import { ImageOwner } from 'src/domain/images/types';
import { LocationQueryService } from 'src/domain/location/services/location-query.service';
import {
  Location,
  LocationOwner,
} from 'src/domain/location/entities/location.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userBalanceQueryService: UserBalanceQueryService,
    private readonly imageQueryService: ImageQueryService,
    private readonly locationQueryService: LocationQueryService,
  ) {}

  @ResolveField(() => [UserBalance])
  async balances(@Parent() { id }: User): Promise<UserBalance[]> {
    return await this.userBalanceQueryService.getBalances(id);
  }

  @ResolveField(() => [Image])
  async photos(@Parent() { id }: User): Promise<Image[]> {
    return await this.imageQueryService.getImagesByOwner(id, ImageOwner.USER);
  }

  @ResolveField(() => [Location])
  async locations(@Parent() { id }: User): Promise<Location[]> {
    const location = await this.locationQueryService.getLocationByOwner(
      id,
      LocationOwner.USER,
    );
    return [location];
  }
}
