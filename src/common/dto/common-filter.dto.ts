import { Field, InputType } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';

@InputType()
export class SortParamsDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ name: 'sort[column]' })
  @Field({ nullable: true })
  column: string = 'sequence_id';

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  @ApiPropertyOptional({ name: 'sort[direction]' })
  @Field({ nullable: true })
  direction: 'ASC' | 'DESC' = 'ASC';
}

@InputType()
export class PaginationParamsDTO {
  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ name: 'pagination[from]' })
  @Field({ nullable: true })
  from: string = '0';

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional({ name: 'pagination[to]' })
  @Field({ nullable: true })
  to: string = '99';

  @Max(100, {
    message: '(to - from) must not be greater than 100',
  })
  get size() {
    return +this.to - +this.from;
  }
}

@InputType()
export class CommonFilterDTO {
  @ValidateNested()
  @Type(() => PaginationParamsDTO)
  @Field({ nullable: true })
  @ApiPropertyOptional({ type: PaginationParamsDTO })
  pagination: PaginationParamsDTO = new PaginationParamsDTO();

  @ValidateNested()
  @Type(() => SortParamsDTO)
  @Field({ nullable: true })
  @ApiPropertyOptional({ type: SortParamsDTO })
  sort: SortParamsDTO = new SortParamsDTO();

  filter?: any;
}
