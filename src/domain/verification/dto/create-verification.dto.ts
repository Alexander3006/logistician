import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { VerificationTargetType } from '../types';

@InputType()
export class CreateVerificationDTO {
  @IsString()
  @Field()
  targetId: string;

  @IsEnum(VerificationTargetType)
  @Field(() => VerificationTargetType)
  type: VerificationTargetType;

  @IsString()
  @Field()
  description: string;
}
