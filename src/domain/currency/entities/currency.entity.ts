import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('currency')
@ObjectType()
export class Currency extends BaseEntity {
  @Field()
  @Column({ unique: true, nullable: false })
  ticker: string;

  @Field()
  @Column({ nullable: false })
  title: string;

  @Field()
  @Column('integer', { nullable: false })
  precision: number;
}
