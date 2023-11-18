import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationCommandService } from './services/location-command.service';
import { LocationQueryService } from './services/location-query.service';
import { AddressQueryService } from './services/address-query.service';
import { AddressCommandService } from './services/address-command.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [
    // services
    AddressQueryService,
    AddressCommandService,
    LocationQueryService,
    LocationCommandService,
  ],
  exports: [
    LocationQueryService,
    LocationCommandService,
    AddressQueryService,
    AddressCommandService,
  ],
})
export class LocationModule {}
