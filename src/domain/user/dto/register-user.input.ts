import { Field, InputType } from '@nestjs/graphql';
import {
  Allow,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { StrategyTypes } from 'src/infrastructure/auth/interfaces/strategy-service.interface';

@InputType()
export class RegisterUserInput {
  @IsEnum(StrategyTypes)
  @Field(() => StrategyTypes)
  strategy: StrategyTypes;

  @Allow()
  @Field({ description: 'Required for not local strategy', nullable: true })
  code?: string;

  @IsOptional()
  @IsEmail()
  @Field({ description: 'Required for local strategy', nullable: true })
  email?: string;

  @Allow()
  @Field({ description: 'Required for local strategy', nullable: true })
  password?: string;

  @Allow()
  @Field({ nullable: true })
  nickname?: string;

  @Allow()
  @Field({ nullable: true })
  name?: string;

  @Allow()
  @Field({ nullable: true })
  lastname?: string;

  @IsPhoneNumber()
  @Field()
  phone?: string;
}
