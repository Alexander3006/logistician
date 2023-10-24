import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class CreateCurrencyDTO {
  @Field()
  @IsString()
  ticker: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsInt()
  precision: number;
}
