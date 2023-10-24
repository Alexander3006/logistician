import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Check, Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Currency } from '../../currency/entities/currency.entity';

@Entity('user_balance')
// @Check('"balance" >= 0')
@Unique('user_currency_uniq_index', ['userId', 'currencyId'])
@ObjectType()
export class UserBalance extends BaseEntity {
  @Field()
  @Column('decimal', { default: '0' })
  balance: string;

  @Field()
  @Column({ name: 'user_id' })
  userId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field()
  @Column({ name: 'currency_id' })
  currencyId: string;

  @Field(() => Currency, { nullable: true })
  @ManyToOne(() => Currency, (type) => type.id)
  @JoinColumn({ name: 'currency_id' })
  currency?: Currency;
}
