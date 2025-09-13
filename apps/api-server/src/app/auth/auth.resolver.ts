import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, CreateUserInput, LoginInput, UserDTO } from '../users/dto/user.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@nx-nestjs-angular/server/orm-entities';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Query(() => UserDTO)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => AuthResponse)
  @UseGuards(GqlAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Args('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshTokens(user.id, refreshToken);
  }
}