import { Field, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { AddressInputDTO } from 'src/domain/location/dto/address.dto';
import { PointInputDTO } from 'src/domain/location/dto/point.dto';

@InputType()
export class CreateOrderDTO {
  @Field()
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => [PointInputDTO])
  locations: PointInputDTO[];

  @Field()
  @IsDate()
  date: Date;

  @Field()
  @IsString()
  cargoTypeId: string;

  @Field()
  @IsNumber()
  @IsPositive()
  price: number;

  @Field()
  @IsPositive()
  @IsNumber()
  insuranceAmount: number;

  @Field()
  @IsString()
  currencyId: string;

  @Field()
  @IsNumber()
  volume: number;

  @Field()
  @IsNumber()
  weight: number;

  @Field(() => [AddressInputDTO])
  fromAddresses: AddressInputDTO[];

  @Field(() => [AddressInputDTO])
  toAddresses: AddressInputDTO[];
}
