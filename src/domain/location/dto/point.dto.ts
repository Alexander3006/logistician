import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PointDTO {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}

@InputType()
export class PointInputDTO {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
