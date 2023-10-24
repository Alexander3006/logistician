import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Car } from 'src/domain/cars/entities/car.entity';
import { User } from 'src/domain/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  REGISTRATION_CERTIFICATE = 'REGISTRATION_CERTIFICATE',
}

registerEnumType(DocumentType, { name: 'DocumentType' });

@Entity('documents')
@ObjectType()
export class Document extends BaseEntity {
  @Field()
  @Column({ unique: true })
  key: string;

  @Field()
  @Column()
  mimetype: string;

  @Field(() => DocumentType)
  @Column('enum', { enum: DocumentType })
  type: DocumentType;

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
  carId: string;

  @ManyToOne(() => User, (type) => type.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'car_id' })
  car?: Car;
}
