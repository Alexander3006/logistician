import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity as BaseEntityOrm,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class BaseEntity extends BaseEntityOrm {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Generated('increment')
  sequence_id: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz', precision: 3 })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz', precision: 3 })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
