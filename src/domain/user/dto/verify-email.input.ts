import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNumberString } from 'class-validator';

@InputType()
export class EmailVerificationPayloadInput {
  @IsEmail()
  @Field((type) => String)
  email: string;

  @IsNumberString()
  @Field((type) => String)
  code: string;
}
