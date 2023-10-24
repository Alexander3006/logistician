import { Module, forwardRef } from '@nestjs/common';
import { LocalStrategyService } from './services/local.strategy.service';
import { GoogleStrategyService } from './services/google.strategy.service';
import { AuthStrategyManager } from './services/strategy-manager.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWTTokenService } from './services/jwt-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserModule } from 'src/domain/user/user.module';
import { MemoryStorageModule } from '../memory-storage/memory-storage.module';
import { FacebookStrategyService } from './services/facebook.strategy.service';
import { TwoFactorAuthenticationService } from './services/two-factor-auth.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
      }),
    }),
    forwardRef(() => UserModule),
    MemoryStorageModule,
  ],
  providers: [
    //auth strategies
    LocalStrategyService,
    GoogleStrategyService,
    FacebookStrategyService,
    //strategy manager
    AuthStrategyManager,
    //services
    JWTTokenService,
    TwoFactorAuthenticationService,
    //passport strategies
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [
    AuthStrategyManager,
    JWTTokenService,
    TwoFactorAuthenticationService,
  ],
})
export class AuthModule {}
