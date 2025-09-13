import { ObjectType, Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { FilterableField, IDField, Relation } from '@ptc-org/nestjs-query-graphql';
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { UserDTO } from '../../users/dto/user.dto';

@ObjectType('Post')
@Relation('author', () => UserDTO)
export class PostDTO {
  @IDField(() => ID)
  id: string;

  @FilterableField()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  excerpt?: string;

  @FilterableField()
  isPublished: boolean;

  @FilterableField({ nullable: true })
  publishedAt?: Date;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @FilterableField()
  authorId: string;

  @FilterableField()
  createdAt: Date;

  @FilterableField()
  updatedAt: Date;
}

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  content: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}