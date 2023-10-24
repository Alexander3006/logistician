import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CommonFilterDTO } from 'src/common/dto/common-filter.dto';
import {
  BalanceHistoryStatus,
  BalanceHistoryType,
} from '../entities/balance-history.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BalanceHistorFilterOptions {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  id?: string;

  @IsEnum(BalanceHistoryType)
  @IsOptional()
  @Field(() => [BalanceHistoryType], { nullable: true })
  type?: BalanceHistoryType;

  @IsEnum(BalanceHistoryStatus)
  @IsOptional()
  @Field(() => BalanceHistoryStatus, { nullable: true })
  status?: BalanceHistoryStatus;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  paymentMethodId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  inCurrencyId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  outCurrencyId: string;
}

@InputType()
export class BalanceHistorFilterDTO extends CommonFilterDTO {
  @ValidateNested()
  @Type(() => BalanceHistorFilterOptions)
  @Field(() => BalanceHistorFilterOptions, { nullable: true })
  filter?: BalanceHistorFilterOptions = new BalanceHistorFilterOptions();
}
