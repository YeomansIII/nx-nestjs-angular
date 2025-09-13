import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Post } from '@nx-nestjs-angular/server/orm-entities';
import { PostDTO, CreatePostInput, UpdatePostInput } from './dto/post.dto';
import { PostsResolver } from './posts.resolver';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Post])],
      dtos: [
        {
          DTOClass: PostDTO,
          CreateDTOClass: CreatePostInput,
          UpdateDTOClass: UpdatePostInput,
          guards: [GqlAuthGuard],
        },
      ],
    }),
  ],
  providers: [PostsResolver],
  exports: [NestjsQueryGraphQLModule],
})
export class PostsModule {}