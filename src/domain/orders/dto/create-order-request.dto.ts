import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateOrderRequestDTO {
  @Field()
  @IsString()
  orderId: string;

  @Field()
  @IsString()
  carId: string;

  @Field()
  @IsNumber()
  @IsPositive()
  price: number;

  @Field()
  @IsNumber()
  @IsPositive()
  insuranceAmount: number;

  @Field()
  @IsString()
  @IsOptional()
  description?: string;
}
