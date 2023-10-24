import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationCommandService } from './services/location-command.service';
import { LocationQueryService } from './services/location-query.service';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [
    // services
    LocationQueryService,
    LocationCommandService,
  ],
  exports: [LocationQueryService, LocationCommandService],
})
export class LocationModule {}
