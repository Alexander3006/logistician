import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Verification } from '../entities/verification.entity';
import { UserQueryService } from 'src/domain/user/services/user-query.service';
import { CarQueryService } from 'src/domain/cars/services/car-query.service';
import { User } from 'src/domain/user/entities/user.entity';
import { Car } from 'src/domain/cars/entities/car.entity';

@Resolver(() => Verification)
export class VerificationResolver {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly carQueryService: CarQueryService,
  ) {}

  @ResolveField(() => User)
  async owner(@Parent() { ownerId }: Verification): Promise<User> {
    return await this.userQueryService.getUser({ id: ownerId });
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() { userId }: Verification): Promise<User> {
    return userId ? await this.userQueryService.getUser({ id: userId }) : null;
  }

  @ResolveField(() => Car, { nullable: true })
  async car(@Parent() { carId }: Verification): Promise<Car> {
    return carId ? await this.carQueryService.getCar(carId) : null;
  }
}
