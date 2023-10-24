import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Car } from '../entities/car.entity';
import { CarCommandService } from '../services/car-command.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { Location } from 'src/domain/location/entities/location.entity';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User } from 'src/domain/user/entities/user.entity';
import { PointInputDTO } from 'src/domain/location/dto/point.dto';

@Resolver(() => Car)
export class CarCommandResolver {
  constructor(private readonly carCommandService: CarCommandService) {}

  @Mutation(() => Location)
  @UseGuards(JwtAuthGuard)
  async updateCarLocation(
    @AuthUser() user: User,
    @Args('carId') carId: string,
    @Args('payload') payload: PointInputDTO,
  ): Promise<Location> {
    const result = await this.carCommandService.updateCarLocation(
      user.id,
      carId,
      payload,
    );
    return result;
  }
}
