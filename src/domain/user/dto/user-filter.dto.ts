import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserRoles } from '../entities/user.entity';
import { CommonFilterDTO } from 'src/common/dto/common-filter.dto';
import { Type } from 'class-transformer';

@InputType()
export class UserFilterOptions {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  name?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  lastname?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  nickname?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsEnum(UserRoles)
  @IsOptional()
  @Field(() => UserRoles, { nullable: true })
  role?: UserRoles;
}

@InputType()
export class UserFilterDTO extends CommonFilterDTO {
  @ValidateNested()
  @Type(() => UserFilterOptions)
  @Field(() => UserFilterOptions, { nullable: true })
  filter?: UserFilterOptions = new UserFilterOptions();
}
