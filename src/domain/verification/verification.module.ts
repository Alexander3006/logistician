import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { UserModule } from '../user/user.module';
import { CarModule } from '../cars/car.module';
import { VerificationQueryService } from './services/verification-query.service';
import { VerificationCommandService } from './services/verification-command.service';
import { VerificationResolver } from './resolvers/verification.resolver';
import { VerificationQueryResolver } from './resolvers/verification-query.resolver';
import { VerificationCommandResolver } from './resolvers/verification-command.resolver';
import { AdminVerificationQueryResolver } from './resolvers/admin-verification-query.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Verification]), UserModule, CarModule],
  providers: [
    // services
    VerificationQueryService,
    VerificationCommandService,
    //resolvers
    VerificationResolver,
    VerificationQueryResolver,
    VerificationCommandResolver,
    AdminVerificationQueryResolver,
    AdminVerificationQueryResolver,
  ],
  exports: [],
})
export class VerificationModule {}
