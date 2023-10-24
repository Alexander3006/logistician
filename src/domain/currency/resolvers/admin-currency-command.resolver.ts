import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Currency } from '../entities/currency.entity';
import { CurrencyCommandService } from '../services/currency-command.service';
import { CreateCurrencyDTO } from '../dto/create-currency.dto';
import { UpdateCurrencyDTO } from '../dto/update-currency.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { UserRoles } from 'src/domain/user/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';

@Resolver(() => Currency)
@UseGuards(JwtAuthGuard, RolesGuards)
@Roles(UserRoles.ADMIN)
export class AdminCurrencyCommandResolver {
  constructor(
    private readonly currencyCommandService: CurrencyCommandService,
  ) {}

  @Mutation(() => Currency)
  async createCurrency(
    @Args('payload') payload: CreateCurrencyDTO,
  ): Promise<Currency> {
    const result = await this.currencyCommandService.createCurrency(payload);
    return result;
  }

  @Mutation(() => Currency)
  async updateCurrency(
    @Args('payload') payload: UpdateCurrencyDTO,
  ): Promise<Currency> {
    const result = await this.currencyCommandService.updateCurrency(payload);
    return result;
  }
}
