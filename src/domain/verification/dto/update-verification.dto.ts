import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateVerificationDTO {
  @IsString()
  @Field()
  id: string;

  @IsString()
  @Field()
  response: string;
}
