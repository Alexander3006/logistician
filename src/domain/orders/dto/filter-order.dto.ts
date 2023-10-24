import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CommonFilterDTO } from 'src/common/dto/common-filter.dto';
import { OrderStatuses } from '../entities/order.entity';

@InputType()
export class OrderFilterOptionsDTO {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  cargoTypeId?: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  minDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  maxDate?: Date;

  @Field({ nullable: true })
  @IsPositive()
  @IsOptional()
  minPrice?: number;

  @Field({ nullable: true })
  @IsPositive()
  @IsOptional()
  maxPrice?: number;

  @Field({ nullable: true })
  @IsPositive()
  @IsOptional()
  minVolume?: number;

  @Field({ nullable: true })
  @IsPositive()
  @IsOptional()
  maxVolume?: number;

  @Field({ nullable: true })
  @IsPositive()
  @IsOptional()
  minWeight?: number;

  @Field({ nullable: true })
  @IsPositive()
  @IsOptional()
  maxWeight?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  currencyId?: string;

  @Field({ nullable: true })
  @IsEnum(OrderStatuses)
  @IsOptional()
  status?: OrderStatuses;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  acceptedRequestId?: string;
}

@InputType()
export class OrderFilterDTO extends CommonFilterDTO {
  @ValidateNested()
  @Type(() => OrderFilterOptionsDTO)
  @Field(() => OrderFilterOptionsDTO, { nullable: true })
  filter?: OrderFilterOptionsDTO = new OrderFilterOptionsDTO();
}
