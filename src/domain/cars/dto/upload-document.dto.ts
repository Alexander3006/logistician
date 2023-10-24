import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString } from 'class-validator';
import { DocumentType } from 'src/domain/documents/entities/document.entity';

@InputType()
export class CarUploadDocumentDTO {
  @IsEnum(DocumentType)
  @Field(() => DocumentType)
  documentType: DocumentType;

  @IsString()
  @Field()
  carId: string;
}
