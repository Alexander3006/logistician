import { Field, InputType } from '@nestjs/graphql';
import { IsNumberString, IsString } from 'class-validator';

@InputType()
export class BalanceUpdateDTO {
  @Field()
  @IsString()
  userId: string;

  @Field()
  @IsString()
  currencyId: string;

  @Field()
  @IsNumberString()
  amount: string;
}
