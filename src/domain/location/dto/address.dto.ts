import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressInputDTO {
  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  region?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  description?: string;
}
