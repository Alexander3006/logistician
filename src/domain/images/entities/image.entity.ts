import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Car } from 'src/domain/cars/entities/car.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('images')
@ObjectType()
export class Image extends BaseEntity {
  @Field()
  @Column({ unique: true })
  key: string;

  @Field()
  @Column()
  mimetype: string;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (type) => type.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'car_id' })
  carId?: string;

  @ManyToOne(() => Car, (type) => type.id)
  @JoinColumn({ name: 'car_id' })
  car?: Car;
}
