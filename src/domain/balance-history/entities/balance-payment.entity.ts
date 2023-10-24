import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BalanceHistory } from './balance-history.entity';
import { BaseEntity } from 'src/common/entities/base-entity';

export enum BalancePaymentStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
registerEnumType(BalancePaymentStatus, { name: 'BalancePaymentStatus' });

@ObjectType()
@Entity('balance_payment')
export class BalancePayment extends BaseEntity {
  @Field({ nullable: true })
  @Column({ name: 'sender_balance_history_id' })
  senderBalanceHistoryId?: string;

  @Field(() => BalanceHistory, { nullable: true })
  @ManyToOne(() => BalanceHistory, (type) => type.id)
  @JoinColumn({ name: 'sender_balance_history_id' })
  senderBalanceHistory?: BalanceHistory;

  @Field({ nullable: true })
  @Column({ name: 'recipient_balance_history_id' })
  recipientBalanceHistoryId?: string;

  @Field(() => BalanceHistory, { nullable: true })
  @ManyToOne(() => BalanceHistory, (type) => type.id)
  @JoinColumn({ name: 'recipient_balance_history_id' })
  recipientBalanceHistory?: BalanceHistory;

  @Field(() => BalancePaymentStatus)
  @Column('enum', {
    enum: BalancePaymentStatus,
    default: BalancePaymentStatus.PENDING,
  })
  status: BalancePaymentStatus;
}
