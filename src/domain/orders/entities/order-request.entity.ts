import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Car } from 'src/domain/cars/entities/car.entity';
import { User } from 'src/domain/user/entities/user.entity';

export enum OrderRequestStatuses {
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(OrderRequestStatuses, { name: 'OrderRequestStatuses' });

@Entity('order_request')
@ObjectType()
export class OrderRequest extends BaseEntity {
  @Field()
  @Column({ name: 'order_id' })
  orderId: string;

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, (type) => type.id)
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column()
  insuranceAmount: number;

  @Field()
  @Column({ length: 255, nullable: true })
  description: string;

  @Field()
  @Column({ name: 'car_id' })
  carId: string;

  @Field(() => Car, { nullable: true })
  @ManyToOne(() => Car, (type) => type.id)
  @JoinColumn({ name: 'car_id' })
  car?: Car;

  @Field()
  @Column({ name: 'owner_id' })
  ownerId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Field(() => OrderRequestStatuses)
  @Column({ enum: OrderRequestStatuses, default: OrderRequestStatuses.CREATED })
  status: OrderRequestStatuses;
}
