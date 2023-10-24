import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TwoFASecret {
  @Field(() => String)
  secret: string;

  @Field(() => String)
  url: string;
}
