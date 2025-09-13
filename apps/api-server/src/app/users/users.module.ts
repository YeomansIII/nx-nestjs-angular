import { Module } from '@nestjs/common';
import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { User } from '@nx-nestjs-angular/server/orm-entities';
import { UserDTO, CreateUserInput, UpdateUserInput } from './dto/user.dto';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([User])],
      dtos: [
        {
          DTOClass: UserDTO,
          CreateDTOClass: CreateUserInput,
          UpdateDTOClass: UpdateUserInput,
          guards: [GqlAuthGuard],
        },
      ],
    }),
  ],
  exports: [NestjsQueryGraphQLModule],
})
export class UsersModule {}