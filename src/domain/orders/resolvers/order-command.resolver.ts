import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { OrderCommandService } from '../services/order-command.service';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User, UserRoles } from 'src/domain/user/entities/user.entity';
import { CreateOrderDTO } from '../dto/create-order.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrderRequestCommandService } from '../services/order-request-command.service';
import { UserVerificationGuard } from 'src/infrastructure/auth/guards/user-verification.guard';

@Resolver(() => Order)
export class OrderCommandResolver {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly orderCommandService: OrderCommandService,
    private readonly orderRequestCommandService: OrderRequestCommandService,
  ) {}

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuards, UserVerificationGuard)
  @Roles(UserRoles.LOGISTICIAN)
  async createOrder(
    @AuthUser() user: User,
    @Args('payload') payload: CreateOrderDTO,
  ): Promise<Order> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.orderCommandService.createOrder(
        user.id,
        payload,
        em,
      );
      return result;
    });
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuards, UserVerificationGuard)
  @Roles(UserRoles.LOGISTICIAN)
  async cancelOrder(
    @AuthUser() user: User,
    @Args('orderId') orderId: string,
  ): Promise<Order> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.orderCommandService.cancelOrderByOwner(
        user.id,
        orderId,
        em,
      );
      return result;
    });
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuards, UserVerificationGuard)
  @Roles(UserRoles.LOGISTICIAN)
  async executeOrder(
    @AuthUser() user: User,
    @Args('orderId') orderId: string,
  ): Promise<Order> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.orderCommandService.executeOrder(
        user.id,
        orderId,
        em,
      );
      return result;
    });
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuards, UserVerificationGuard)
  @Roles(UserRoles.LOGISTICIAN)
  async acceptOrderRequest(
    @AuthUser() user: User,
    @Args('requestId') requestId: string,
  ): Promise<Order> {
    return await this.entityManager.transaction(async (em: EntityManager) => {
      const result = await this.orderRequestCommandService.acceptOrderRequest(
        user.id,
        requestId,
        em,
      );
      return result;
    });
  }
}
