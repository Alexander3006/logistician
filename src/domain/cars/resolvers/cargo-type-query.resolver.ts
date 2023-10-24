import { Query, Resolver } from '@nestjs/graphql';
import { CargoType } from '../entities/cargo-type.entity';
import { CargoTypeQueryService } from '../services/cargo-type-query.service';

@Resolver(() => CargoType)
export class CargoTypeQueryResolver {
  constructor(private readonly cargoTypeQueryService: CargoTypeQueryService) {}

  @Query(() => [CargoType])
  async getCargoTypes(): Promise<CargoType[]> {
    const result = await this.cargoTypeQueryService.getCargoTypes();
    return result;
  }
}
