import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CommonFilterDTO } from 'src/common/dto/common-filter.dto';

@InputType()
export class OrderFeedbackFilterOptionsDTO {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  id?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  customerId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  executorId?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  orderId?: string;
}

@InputType()
export class OrderFeedbackFilterDTO extends CommonFilterDTO {
  @ValidateNested()
  @Type(() => OrderFeedbackFilterOptionsDTO)
  @Field(() => OrderFeedbackFilterOptionsDTO, { nullable: true })
  filter?: OrderFeedbackFilterOptionsDTO = new OrderFeedbackFilterOptionsDTO();
}
