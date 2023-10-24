import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrderRequest } from '../entities/order-request.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrderRequestCommandService } from '../services/order-request-command.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User, UserRoles } from 'src/domain/user/entities/user.entity';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { CreateOrderRequestDTO } from '../dto/create-order-request.dto';
import { UserVerificationGuard } from 'src/infrastructure/auth/guards/user-verification.guard';

@Resolver(() => OrderRequest)
export class OrderRequestCommandResolver {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly orderRequestCommandService: OrderRequestCommandService,
  ) {}

  @Mutation(() => OrderRequest)
  @UseGuards(JwtAuthGuard, RolesGuards, UserVerificationGuard)
  @Roles(UserRoles.BUSINESS_OWNER, UserRoles.DRIVER)
  async createOrderRequest(
    @AuthUser() user: User,
    @Args('payload') dto: CreateOrderRequestDTO,
  ): Promise<OrderRequest> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.orderRequestCommandService.createOrderRequest(
        user.id,
        dto,
        em,
      );
      return result;
    });
  }

  @Mutation(() => OrderRequest)
  @UseGuards(JwtAuthGuard, RolesGuards, UserVerificationGuard)
  @Roles(UserRoles.BUSINESS_OWNER, UserRoles.DRIVER)
  async cancelOrderRequest(
    @AuthUser() user: User,
    @Args('orderId') orderId: string,
  ): Promise<OrderRequest> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.orderRequestCommandService.cancelOrderRequest(
        user.id,
        orderId,
        em,
      );
      return result;
    });
  }
}
