import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Currency } from 'src/domain/currency/entities/currency.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum BalanceHistoryStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
registerEnumType(BalanceHistoryStatus, { name: 'BalanceHistoryStatus' });

export enum BalanceHistoryType {
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
  PAYMENT = 'Payment',
}
registerEnumType(BalanceHistoryType, { name: 'BalanceHistoryType' });

@Entity('balance_history')
@ObjectType()
export class BalanceHistory extends BaseEntity {
  @Field(() => BalanceHistoryType)
  @Column('enum', { enum: BalanceHistoryType })
  type: BalanceHistoryType;

  @Field(() => BalanceHistoryStatus)
  @Column('enum', { enum: BalanceHistoryStatus })
  status: BalanceHistoryStatus;

  @Field()
  @Column('numeric', { precision: 30, scale: 18, default: '0' })
  inAmount: string;

  @Field()
  @Column('numeric', { precision: 30, scale: 18, default: '0' })
  outAmount: string;

  @Field()
  @Column('numeric', { precision: 30, scale: 18, default: '0' })
  feeAmount: string;

  @Field()
  @Column({ name: 'in_currency_id', nullable: true })
  inCurrencyId: string;

  @Field(() => Currency, { nullable: true })
  @ManyToOne(() => Currency, (type) => type.id)
  @JoinColumn({ name: 'in_currency_id' })
  inCurrency?: Currency;

  @Field()
  @Column({ name: 'out_currency_id', nullable: true })
  outCurrencyId: string;

  @Field(() => Currency, { nullable: true })
  @ManyToOne(() => Currency, (type) => type.id)
  @JoinColumn({ name: 'out_currency_id' })
  outCurrency?: Currency;

  @Field()
  @Column({ name: 'fee_currency_id', nullable: true })
  feeCurrencyId: string;

  @Field(() => Currency, { nullable: true })
  @ManyToOne(() => Currency, (type) => type.id)
  @JoinColumn({ name: 'fee_currency_id' })
  feeCurrency?: Currency;

  @Field()
  @Column({ name: 'user_id' })
  userId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
