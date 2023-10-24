import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CommonFilterDTO } from 'src/common/dto/common-filter.dto';
import { OrderRequestStatuses } from '../entities/order-request.entity';

@InputType()
export class OrderRequestFilterOptionsDTO {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  orderId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  carId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @Field({ nullable: true })
  @IsEnum(OrderRequestStatuses)
  @IsOptional()
  status?: OrderRequestStatuses;
}

@InputType()
export class OrderRequestFilterDTO extends CommonFilterDTO {
  @ValidateNested()
  @Type(() => OrderRequestFilterOptionsDTO)
  @Field(() => OrderRequestFilterOptionsDTO, { nullable: true })
  filter?: OrderRequestFilterOptionsDTO = new OrderRequestFilterOptionsDTO();
}
