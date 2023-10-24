import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/infrastructure/auth/auth.module';
import { UserCommandService } from './services/user-command.service';
import { UserCommandResolver } from './resolvers/user-command.resolver';
import { UserQueryService } from './services/user-query.service';
import { UserAuthService } from './services/user-auth.service';
import { UserAuthResolver } from './resolvers/user-auth.resolver';
import { MemoryStorageModule } from 'src/infrastructure/memory-storage/memory-storage.module';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { EmailVerificationService } from './services/email-verification.service';
import { RateLimiterModule, RateLimiterOptions } from 'nestjs-rate-limiter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, RedisService } from 'nestjs-redis';
import { UserCredentialsService } from './services/user-credentials.service';
import { UserCredentialsResolver } from './resolvers/user-credentials.resolver';
import { UserSession } from './entities/session.entity';
import { SessionCommandService } from './services/session-command.service';
import { SessionQueryService } from './services/session-query.service';
import { UserQueryResolver } from './resolvers/user-query.resolver';
import { CurrencyModule } from '../currency/currency.module';
import { UserBalanceQueryService } from './services/balance-query.service';
import { UserBalanceCommandService } from './services/balance-command.service';
import { UserResolver } from './resolvers/user.resolver';
import { UserBalanceResolver } from './resolvers/balance.resolver';
import { EmailVerificationResolver } from './resolvers/email-verification.resolver';
import { UserBalance } from './entities/user-balance.entity';
import { AdminUserBalanceResolver } from './resolvers/admin-balance.resolver';
import { ImageModule } from '../images/image.module';
import { DocumentModule } from '../documents/document.module';
import { UserVerificationSetuperService } from './services/user-verification-setuper.service';
import { LocationModule } from '../location/location.module';

const rateLimiter = RateLimiterModule.registerAsync({
  useFactory: (
    config: ConfigService,
    redisService: RedisService,
  ): RateLimiterOptions => {
    return {
      for: 'ExpressGraphql',
      type: 'Redis',
      keyPrefix: 'rate-limiter',
      storeClient: redisService.getClient('storage'),
      points: 5, // 5 requests
      duration: 10 * 60, // 10m
    };
  },
  inject: [ConfigService, RedisService],
  imports: [ConfigModule, RedisModule],
});

@Module({
  imports: [
    rateLimiter,
    TypeOrmModule.forFeature([User, UserSession, UserBalance]),
    AuthModule,
    MemoryStorageModule,
    MailModule,
    CurrencyModule,
    ImageModule,
    DocumentModule,
    LocationModule,
  ],
  controllers: [],
  providers: [
    //services
    UserCommandService,
    UserQueryService,
    UserAuthService,
    EmailVerificationService,
    UserCredentialsService,
    SessionCommandService,
    SessionQueryService,
    UserBalanceQueryService,
    UserBalanceCommandService,
    UserVerificationSetuperService,
    //resolvers
    UserResolver,
    UserAuthResolver,
    UserCommandResolver,
    EmailVerificationResolver,
    UserCredentialsResolver,
    UserQueryResolver,
    UserBalanceResolver,
    AdminUserBalanceResolver,
  ],
  exports: [
    UserQueryService,
    SessionQueryService,
    UserBalanceCommandService,
    UserCommandService,
    UserVerificationSetuperService,
  ],
})
export class UserModule {}
