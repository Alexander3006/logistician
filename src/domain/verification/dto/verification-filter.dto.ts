import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CommonFilterDTO } from 'src/common/dto/common-filter.dto';
import { Type } from 'class-transformer';
import { VerificationStatus, VerificationTargetType } from '../types';

@InputType()
export class VerificationFilterOptions {
  @IsEnum(VerificationStatus)
  @IsOptional()
  @Field(() => VerificationStatus, { nullable: true })
  status?: VerificationStatus;

  @IsEnum(VerificationTargetType)
  @IsOptional()
  @Field(() => VerificationTargetType, { nullable: true })
  type?: VerificationTargetType;

  @IsString()
  @IsOptional()
  @Field()
  ownerId?: string;
}

@InputType()
export class VerificationFilterDTO extends CommonFilterDTO {
  @ValidateNested()
  @Type(() => VerificationFilterOptions)
  @Field(() => VerificationFilterOptions, { nullable: true })
  filter?: VerificationFilterOptions = new VerificationFilterOptions();
}
