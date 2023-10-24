import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { OrderFeedback } from '../entities/order-feedback.entity';
import { OrderFeedbackCommandService } from '../services/order-feedback-command.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuards } from 'src/common/guards/roles.guard';
import { UserVerificationGuard } from 'src/infrastructure/auth/guards/user-verification.guard';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { User } from 'src/domain/user/entities/user.entity';
import { CreateOrderFeedbackDTO } from '../dto/create-order-feedback.dto';

@Resolver(() => OrderFeedback)
export class OrderFeedbackCommandResolver {
  constructor(
    private readonly orderFeedbackCommandService: OrderFeedbackCommandService,
  ) {}

  @Mutation(() => OrderFeedback)
  @UseGuards(JwtAuthGuard, RolesGuards, UserVerificationGuard)
  async createOrderFeedback(
    @AuthUser() user: User,
    @Args('payload') dto: CreateOrderFeedbackDTO,
  ): Promise<OrderFeedback> {
    const result = await this.orderFeedbackCommandService.createOrderFeedback(
      user.id,
      dto,
    );
    return result;
  }
}
