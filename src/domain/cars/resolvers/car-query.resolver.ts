import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Car } from '../entities/car.entity';
import { GetPaginatedDTO } from 'src/common/dto/paginated.dto';
import { CarQueryService } from '../services/car-query.service';
import { CarFilterDTO } from '../dto/car-filter.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { Document } from 'src/domain/documents/entities/document.entity';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User } from 'src/domain/user/entities/user.entity';
import { AppException } from 'src/common/exceptions';

@ObjectType()
class CarPaginated extends GetPaginatedDTO(Car) {}

@Resolver(() => Car)
export class CarQueryResolver {
  constructor(private readonly carQueryService: CarQueryService) {}

  @Query(() => CarPaginated)
  async getFilteredCars(
    @Args('payload') payload: CarFilterDTO,
  ): Promise<CarPaginated> {
    const result = await this.carQueryService.getFilteredCars(payload);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Document])
  async getCarDocuments(
    @Args('carId') carId: string,
    @AuthUser() user: User,
  ): Promise<Document[]> {
    const car = await this.carQueryService.getCarByOwner(user.id, carId);
    if (!car)
      throw new AppException({
        message: `Car with owner ${user.id} and id ${carId} not found`,
        code: 'CAR_NOT_FOUND',
        statusCode: 404,
      });
    const documents = await this.carQueryService.getCarDocuments(carId);
    return documents;
  }
}
