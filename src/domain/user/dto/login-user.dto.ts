import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Allow, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { StrategyTypes } from 'src/infrastructure/auth/interfaces/strategy-service.interface';
import { User } from '../entities/user.entity';

@InputType()
export class LoginUserInput {
  @IsEnum(StrategyTypes)
  @Field(() => StrategyTypes)
  strategy: StrategyTypes;

  @Allow()
  @Field({ description: '2FA code', nullable: true })
  code?: string;

  @IsOptional()
  @IsEmail()
  @Field({ description: 'Required for local strategy', nullable: true })
  email?: string;

  @Allow()
  @Field({ description: 'Required for local strategy', nullable: true })
  password?: string;
}

@ObjectType()
class Tokens {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}

@ObjectType()
export class LoginUserResponse {
  @Field(() => User)
  user: User;

  @Field(() => Tokens, { nullable: true })
  tokens?: Tokens;
}
