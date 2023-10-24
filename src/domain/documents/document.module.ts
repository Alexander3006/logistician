import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { FileModule } from 'src/infrastructure/file/file.module';
import { DocumentQueryService } from './services/document-query.service';
import { DocumentCommandService } from './services/document-command.service';
import { DocumentResolver } from './resolvers/document.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), FileModule],
  providers: [
    //services
    DocumentQueryService,
    DocumentCommandService,
    //resolvers
    DocumentResolver,
  ],
  exports: [DocumentQueryService, DocumentCommandService],
})
export class DocumentModule {}
