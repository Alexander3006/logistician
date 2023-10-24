import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderFeedback } from './entities/order-feedback.entity';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../orders/order.module';
import { OrderFeedbackQueryService } from './services/order-feedback-query.service';
import { OrderFeedbackCommandService } from './services/order-feedback-command.service';
import { OrderFeedbackResolver } from './resolvers/order-feedack.resolver';
import { OrderFeedbackQueryResolver } from './resolvers/order-feedback-query.resolver';
import { OrderFeedbackCommandResolver } from './resolvers/order-feedback-command.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([OrderFeedback]), UserModule, OrderModule],
  providers: [
    // services
    OrderFeedbackQueryService,
    OrderFeedbackCommandService,
    // resolvers
    OrderFeedbackResolver,
    OrderFeedbackQueryResolver,
    OrderFeedbackCommandResolver,
  ],
  exports: [],
})
export class FeedbackModule {}
