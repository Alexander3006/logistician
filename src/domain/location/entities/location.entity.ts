import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Car } from 'src/domain/cars/entities/car.entity';
import { Order } from 'src/domain/orders/entities/order.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Point } from 'geojson';

import { PointDTO } from '../dto/point.dto';

export enum LocationOwner {
  USER = 'USER',
  CAR = 'CAR',
  ORDER = 'ORDER',
}

export const LocationOwnerMap = {
  USER: 'userId',
  CAR: 'carId',
  ORDER: 'orderId',
};

@ObjectType()
@Entity('location')
export class Location extends BaseEntity {
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    name: 'coordinates',
  })
  _coordinates: Point;

  @Field(() => PointDTO)
  get coordinates(): PointDTO {
    const [longitude, latitude] = this._coordinates.coordinates;
    const point: PointDTO = { longitude, latitude };
    return point;
  }

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'user_id', unique: true })
  userId: string;

  @ManyToOne(() => User, (type) => type.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Field({ nullable: true })
  @Column({ nullable: true, name: 'car_id', unique: true })
  carId: string;

  @ManyToOne(() => User, (type) => type.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'car_id' })
  car?: Car;

  @Field({ nullable: true })
  @Column({ name: 'order_id', nullable: true, unique: true })
  orderId?: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order?: Order;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  description?: string;
}
