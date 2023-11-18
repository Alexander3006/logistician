import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Order } from 'src/domain/orders/entities/order.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum AddressOwner {
  // USER = 'USER',
  // CAR = 'CAR',
  ORDER = 'ORDER',
}

export const AddressOwnerMap = {
  // USER: 'userId',
  // CAR: 'carId',
  ORDER: 'orderId',
};

@ObjectType()
@Entity('address')
export class Address extends BaseEntity {
  @Field({ nullable: true })
  @Column({ name: 'order_id', nullable: true, unique: true })
  orderId?: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  country?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  region?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  description?: string;
}
