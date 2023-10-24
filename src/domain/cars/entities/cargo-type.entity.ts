import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('cargo_type')
@ObjectType()
export class CargoType extends BaseEntity {
  @Field()
  @Column({ length: 255, nullable: false })
  name: string;

  @Field()
  @Column({ length: 255, nullable: false })
  description: string;
}
