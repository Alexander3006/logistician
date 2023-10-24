import { Args, Query, Resolver } from '@nestjs/graphql';
import { Car } from '../entities/car.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { UserRoles } from 'src/domain/user/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CarQueryService } from '../services/car-query.service';
import { Document } from 'src/domain/documents/entities/document.entity';

@Resolver(() => Car)
@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRoles.ADMIN)
export class AdminCarQueryResolver {
  constructor(private readonly carQueryService: CarQueryService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Document])
  async adminGetCarDocuments(
    @Args('carId') carId: string,
  ): Promise<Document[]> {
    const documents = await this.carQueryService.getCarDocuments(carId);
    return documents;
  }
}
