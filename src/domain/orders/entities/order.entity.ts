import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { CargoType } from 'src/domain/cars/entities/cargo-type.entity';
import { User } from 'src/domain/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrderRequest } from './order-request.entity';
import { Currency } from 'src/domain/currency/entities/currency.entity';
import { BalancePayment } from 'src/domain/balance-history/entities/balance-payment.entity';
import { Location } from 'src/domain/location/entities/location.entity';

export enum OrderStatuses {
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  SUCCESS = 'SUCCESS',
  CONFLICT = 'CONFLICT',
}

registerEnumType(OrderStatuses, { name: 'OrderStatuses' });

@Entity('order')
@ObjectType()
export class Order extends BaseEntity {
  @Field()
  @Column({ length: 255, nullable: true })
  description: string;

  @Field()
  @Column('timestamptz')
  date: Date;

  @Field()
  @Column({ name: 'cargo_type_id' })
  cargoTypeId: string;

  @Field(() => CargoType, { nullable: true })
  @ManyToOne(() => CargoType, (type) => type.id)
  cargoType?: CargoType;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column({ name: 'currency_id' })
  currencyId: string;

  @Field()
  @Column()
  insuranceAmount: number;

  @Field(() => Currency, { nullable: true })
  @ManyToOne(() => Currency, (type) => type.id)
  @JoinColumn({ name: 'currency_id' })
  currency?: Currency;

  @Field()
  @Column()
  volume: number;

  @Field()
  @Column()
  weight: number;

  @Field()
  @Column({ name: 'owner_id' })
  ownerId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Field(() => OrderStatuses)
  @Column({ enum: OrderStatuses, default: OrderStatuses.CREATED })
  status: OrderStatuses;

  @Field()
  @Column({ name: 'accepted_request_id', nullable: true })
  acceptedRequestId?: string;

  @Field(() => OrderRequest, { nullable: true })
  @OneToOne(() => OrderRequest, (type) => type.id)
  @JoinColumn({ name: 'accepted_request_id' })
  acceptedRequest?: OrderRequest;

  @Field({ nullable: true })
  @Column({ name: 'balance_payment_id', nullable: true })
  balancePaymentId?: string;

  @Field(() => BalancePayment, { nullable: true })
  @ManyToOne(() => BalancePayment, (type) => type.id)
  @JoinColumn({ name: 'balance_payment_id' })
  balancePayment?: BalancePayment;

  @Field({ nullable: true })
  @Column({ name: 'balance_compensation_id', nullable: true })
  balanceCompensationId?: string;

  @Field(() => BalancePayment, { nullable: true })
  @ManyToOne(() => BalancePayment, (type) => type.id)
  @JoinColumn({ name: 'balance_compensation_id' })
  balanceCompensaction?: BalancePayment;

  @Field(() => [Location], { nullable: true })
  @OneToMany(() => Location, (location) => location.order)
  locations?: Location[];
}
