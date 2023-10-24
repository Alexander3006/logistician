import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CommonFilterDTO } from 'src/common/dto/common-filter.dto';

@InputType()
export class CarFilterOptionsDTO {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  driverId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  typeId?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  minLoadCapacity?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  maxLoadCapacity?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  minVolume?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  maxVolume?: string;

  @Field()
  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}

@InputType()
export class CarFilterDTO extends CommonFilterDTO {
  @ValidateNested()
  @Type(() => CarFilterOptionsDTO)
  @Field(() => CarFilterOptionsDTO, { nullable: true })
  filter?: CarFilterOptionsDTO = new CarFilterOptionsDTO();
}
