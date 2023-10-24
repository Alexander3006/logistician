import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CarCommandService } from './services/car-command.service';
import { CarResolver } from './resolvers/car.resolver';
import { BusinessOwnerCommandResolver } from './resolvers/business-owner-command.resolver';
import { AdminCargoTypeCommandResolver } from './resolvers/admin-cargo-type-command.resolver';
import { CargoTypeQueryResolver } from './resolvers/cargo-type-query.resolver';
import { CargoTypeQueryService } from './services/cargo-type-query.service';
import { CargoTypeCommandService } from './services/cargo-type.command.service';
import { CarQueryService } from './services/car-query.service';
import { CarQueryResolver } from './resolvers/car-query.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { CargoType } from './entities/cargo-type.entity';
import { DocumentModule } from '../documents/document.module';
import { CarVerificationSetuperService } from './services/car-verification-setuper.service';
import { ImageModule } from '../images/image.module';
import { CarCommandResolver } from './resolvers/car-command.resolver';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, CargoType]),
    UserModule,
    DocumentModule,
    ImageModule,
    LocationModule,
  ],
  providers: [
    //services
    CarQueryService,
    CarCommandService,
    CargoTypeQueryService,
    CargoTypeCommandService,
    CarVerificationSetuperService,
    //resolvers
    CarResolver,
    CarQueryResolver,
    CarCommandResolver,
    BusinessOwnerCommandResolver,
    AdminCargoTypeCommandResolver,
    CargoTypeQueryResolver,
  ],
  controllers: [],
  exports: [
    CargoTypeQueryService,
    CarCommandService,
    CarVerificationSetuperService,
    CarQueryService,
  ],
})
export class CarModule {}
