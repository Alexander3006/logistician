import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateOrderFeedbackDTO {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  comment?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  @Field()
  rating: number;

  @IsString()
  @Field()
  orderId: string;
}
