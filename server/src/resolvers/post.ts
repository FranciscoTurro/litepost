import { Post } from '../entities/Post';
import { Resolver, Query } from 'type-graphql';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts() {
    return 'asdf';
  }
}
