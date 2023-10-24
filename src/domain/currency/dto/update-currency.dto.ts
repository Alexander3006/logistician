import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCurrencyDTO } from './create-currency.dto';
import { IsString } from 'class-validator';

@InputType()
export class UpdateCurrencyDTO extends PartialType(CreateCurrencyDTO) {
  @Field()
  @IsString()
  id: string;
}
