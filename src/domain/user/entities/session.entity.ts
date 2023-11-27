import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('user_session')
@ObjectType()
export class UserSession extends BaseEntity {
  @Field(() => String, { nullable: false })
  @Column({ nullable: false, default: '' })
  device: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: true, default: '' })
  ip: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true, default: '' })
  locale?: string;

  @Field(() => Boolean, { nullable: false })
  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ nullable: false })
  accessToken: string;

  @Column({ nullable: false })
  refreshToken: string;

  @Field(() => String, { nullable: false })
  @Column({ name: 'user_id' })
  userId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
