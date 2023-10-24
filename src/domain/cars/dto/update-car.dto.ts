import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCarDTO } from './create-car.dto';
import { IsString } from 'class-validator';

@InputType()
export class UpdateCarDTO extends PartialType(CreateCarDTO) {
  @Field()
  @IsString()
  id: string;
}
