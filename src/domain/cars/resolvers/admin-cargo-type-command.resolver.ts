import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CargoType } from '../entities/cargo-type.entity';
import { CargoTypeCommandService } from '../services/cargo-type.command.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { UserRoles } from 'src/domain/user/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateCargoTypeDTO } from '../dto/create-cargo-type.dto';

@Resolver(() => CargoType)
@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRoles.ADMIN)
export class AdminCargoTypeCommandResolver {
  constructor(
    private readonly cargoTypeCommandService: CargoTypeCommandService,
  ) {}

  @Mutation(() => CargoType)
  async adminCreateCargoType(
    @Args('payload') payload: CreateCargoTypeDTO,
  ): Promise<CargoType> {
    const result = await this.cargoTypeCommandService.createCargoType(payload);
    return result;
  }

  @Mutation(() => Boolean)
  async adminDeleteCargoType(
    @Args('cargoTypeId') cargoTypeId: string,
  ): Promise<boolean> {
    const result = await this.cargoTypeCommandService.deleteCargoType(
      cargoTypeId,
    );
    return result;
  }
}
