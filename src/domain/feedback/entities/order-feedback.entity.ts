import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Order } from 'src/domain/orders/entities/order.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@ObjectType()
@Entity('order_feedback')
@Check('"rating" >= 0')
@Check('"rating" <= 10')
export class OrderFeedback extends BaseEntity {
  @Field()
  @Column({ length: 511, nullable: true })
  comment?: string;

  @Field()
  @Column({ nullable: false })
  rating: number;

  @Field({ nullable: true })
  @Column({ name: 'customer_id', nullable: true })
  customerId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'customer_id' })
  customer?: User;

  @Field({ nullable: true })
  @Column({ name: 'executor_id' })
  executorId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'executor_id' })
  executor?: User;

  @Field()
  @Column({ name: 'order_id' })
  orderId: string;

  @Field(() => Order, { nullable: true })
  @ManyToOne(() => Order, (type) => type.id)
  @JoinColumn({ name: 'order_id' })
  order?: Order;
}
