import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IPaginatedDTO<T> {
  count: number;
  data: T[];
}

export function GetPaginatedDTO<T>(classRef: Type<T>) {
  @ObjectType(`${classRef.name}Paginated`, { isAbstract: true })
  abstract class PaginatedDTO {
    @Field()
    count: number;

    @Field(() => [classRef])
    data: T[];
  }
  return PaginatedDTO;
}
