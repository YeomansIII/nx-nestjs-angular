import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { CRUDResolver } from '@ptc-org/nestjs-query-graphql';
import { Post, User } from '@nx-nestjs-angular/server/orm-entities';
import { PostDTO, CreatePostInput, UpdatePostInput } from './dto/post.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => PostDTO)
@UseGuards(GqlAuthGuard)
export class PostsResolver extends CRUDResolver(PostDTO, {
  CreateDTOClass: CreatePostInput,
  UpdateDTOClass: UpdatePostInput,
}) {
  constructor(
    @InjectQueryService(Post) readonly service: QueryService<Post>
  ) {
    super(service);
  }

  async beforeCreateOne(
    input: CreatePostInput,
    context: any
  ): Promise<CreatePostInput> {
    const user = context.req.user as User;
    return {
      ...input,
      authorId: user.id,
    } as any;
  }
}