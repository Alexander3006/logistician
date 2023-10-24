import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateCarDTO {
  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  @IsOptional()
  driverId?: string;

  @Field()
  @IsString()
  typeId: string;

  @Field()
  @IsPositive()
  loadCapacity: number;

  @Field()
  @IsPositive()
  volume: number;
}
