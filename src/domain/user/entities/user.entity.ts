import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserSession } from './session.entity';
import { UserBalance } from './user-balance.entity';
import { Image } from 'src/domain/images/entities/image.entity';
import { Location } from 'src/domain/location/entities/location.entity';

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  LOGISTICIAN = 'LOGISTICIAN',
  DRIVER = 'DRIVER',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
}

registerEnumType(UserRoles, { name: 'UserRoles' });

@Entity('user')
@ObjectType()
export class User extends BaseEntity {
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastname: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  nickname?: string;

  @Field(() => String, { nullable: false })
  @Column({ nullable: true, length: 255 })
  phone?: string;

  @Field(() => UserRoles, { nullable: false })
  @Column({ enum: UserRoles, nullable: false, default: UserRoles.USER })
  role: UserRoles;

  // credentials
  @Field(() => String)
  @Column({ unique: true, nullable: false })
  email: string;

  // @Field(() => String)
  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ default: false })
  verified: boolean;

  //2fa
  @Column({ nullable: true })
  twoFASecret: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isTwoFAEnabled: boolean;

  //sessions
  @OneToMany(() => UserSession, (session) => session.user, { cascade: true })
  sessions?: UserSession[];

  @Field(() => [UserBalance], { nullable: true })
  @OneToMany(() => UserBalance, (balance) => balance.user, { cascade: true })
  balances?: UserBalance[];

  @Field(() => [Image], { nullable: true })
  @OneToMany(() => Image, (image) => image.user)
  photos?: Image[];

  @Field(() => [Location], { nullable: true })
  @OneToMany(() => Location, (location) => location.user)
  locations?: Location[];
}
