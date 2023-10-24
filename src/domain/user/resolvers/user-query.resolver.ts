import { Args, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { UserQueryService } from '../services/user-query.service';
import { GetPaginatedDTO, IPaginatedDTO } from 'src/common/dto/paginated.dto';
import { User } from '../entities/user.entity';
import { UserFilterDTO } from '../dto/user-filter.dto';
import { Document } from 'src/domain/documents/entities/document.entity';
import { AuthUser } from 'src/infrastructure/auth/decorators/auth-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { DocumentQueryService } from 'src/domain/documents/services/document-query.service';
import { DocumentOwner } from 'src/domain/documents/types';

@ObjectType()
class UserPaginated extends GetPaginatedDTO(User) {}

@Resolver(() => User)
export class UserQueryResolver {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly documentQueryService: DocumentQueryService,
  ) {}

  @Query(() => UserPaginated)
  async getFilteredUsers(
    @Args('payload') payload: UserFilterDTO,
  ): Promise<UserPaginated> {
    const result = await this.userQueryService.getFilteredUsers(payload);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Document])
  async getUserDocuments(@AuthUser() user: User): Promise<Document[]> {
    const documents = await this.documentQueryService.getDocumentsByOwner(
      user.id,
      DocumentOwner.USER,
    );
    return documents;
  }
}
