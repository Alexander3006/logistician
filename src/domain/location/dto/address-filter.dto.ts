import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class AddressFilterOptions {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  country?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  region?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  city?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  address?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;
}
