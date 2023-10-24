import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  BalanceHistoryStatus,
  BalanceHistoryType,
} from '../entities/balance-history.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class BalanceHistorStatsDTO {
  @IsDate()
  @IsOptional()
  @Field()
  fromDate?: Date;

  @IsDate()
  @IsOptional()
  @Field()
  toDate?: Date;

  @IsString()
  @IsOptional()
  @Field()
  convertTotalToCurrencyId?: string;

  @IsEnum(BalanceHistoryType)
  @IsOptional()
  @Field(() => BalanceHistoryType, { nullable: true })
  type?: BalanceHistoryType;

  @IsEnum(BalanceHistoryStatus)
  @IsOptional()
  @Field(() => BalanceHistoryStatus, { nullable: true })
  status?: BalanceHistoryStatus;
}

@ObjectType()
export class BalanceHistoryStatsByCurrency {
  @Field()
  currencyId: string;

  @Field()
  amount: string;

  @Field()
  count: string;
}

@ObjectType()
export class BalanceHistoryStatsResponse {
  @Field(() => [BalanceHistoryStatsByCurrency])
  statsIn: BalanceHistoryStatsByCurrency[];

  @Field(() => [BalanceHistoryStatsByCurrency])
  statsOut: BalanceHistoryStatsByCurrency[];

  @Field(() => [BalanceHistoryStatsByCurrency])
  statsFee: BalanceHistoryStatsByCurrency[];
}
