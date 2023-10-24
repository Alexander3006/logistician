import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Car } from 'src/domain/cars/entities/car.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { VerificationStatus, VerificationTargetType } from '../types';

@Entity('verification')
@ObjectType()
export class Verification extends BaseEntity {
  @Field(() => VerificationStatus)
  @Column('enum', {
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Field()
  @Column()
  response: string;

  @Field()
  @Column()
  description: string;

  @Field({ nullable: true })
  @Column({ name: 'owner_id', nullable: true })
  ownerId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Field(() => VerificationTargetType)
  @Column('enum', { enum: VerificationTargetType })
  type: VerificationTargetType;

  @Field({ nullable: true })
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field({ nullable: true })
  @Column({ name: 'car_id', nullable: true })
  carId?: string;

  @Field(() => Car, { nullable: true })
  @ManyToOne(() => Car, (type) => type.id)
  @JoinColumn({ name: 'car_id' })
  car?: Car;
}
