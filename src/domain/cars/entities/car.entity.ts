import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CargoType } from './cargo-type.entity';
import { Image } from 'src/domain/images/entities/image.entity';
import { Location } from 'src/domain/location/entities/location.entity';

// TODO: add photos
@Entity('car')
@ObjectType()
export class Car extends BaseEntity {
  @Field()
  @Column({ length: 255 })
  description: string;

  @Field()
  @Column({ name: 'owner_id' })
  ownerId: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Field({ nullable: true })
  @Column({ name: 'driver_id', nullable: true })
  driverId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (type) => type.id)
  @JoinColumn({ name: 'driver_id' })
  driver?: User;

  @Field()
  @Column({ name: 'cargo_type_id' })
  typeId: string;

  @Field(() => CargoType, { nullable: true })
  @ManyToOne(() => CargoType, (type) => type.id)
  @JoinColumn({ name: 'cargo_type_id' })
  type?: CargoType;

  @Field()
  @Column()
  loadCapacity: number;

  @Field()
  @Column()
  volume: number;

  @Field()
  @Column({ default: false })
  verified: boolean;

  @Field(() => [Image], { nullable: true })
  @OneToMany(() => Image, (image) => image.user)
  photos?: Image[];

  @Field(() => [Location], { nullable: true })
  @OneToMany(() => Location, (location) => location.car)
  locations?: Location[];
}
