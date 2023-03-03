import { Post } from '../entities/Post';
import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  UseMiddleware,
  FieldResolver,
  Root,
} from 'type-graphql';
import { MyContext } from '../types/types';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { Loaded } from '@mikro-orm/core';

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text?.slice(0, 50);
  }

  @Query(() => [Post])
  async getPosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    const cappedLimit = Math.min(50, limit);

    let posts: Loaded<Post, never>[];
    if (cursor) {
      posts = await em.find(
        Post,
        { createdAt: { $lt: new Date(parseInt(cursor)) } },
        { orderBy: { createdAt: 'DESC' }, limit: cappedLimit }
      );
    } else {
      posts = await em.find(
        Post,
        {},
        { orderBy: { createdAt: 'DESC' }, limit: cappedLimit }
      );
    }

    return posts;
  }

  @Query(() => Post, { nullable: true })
  getPost(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input', () => PostInput) input: PostInput,
    @Ctx() { em, req }: MyContext
  ): Promise<Post> {
    const user = await em.findOne(User, req.session.userId!);
    if (!user) throw new Error('User not found');

    if (input.title.length === 0)
      throw new Error('Cant have an empty post title');

    const post = em.create(Post, {
      ...input,
      creator: user,
    });

    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, id);
    if (!post) return null;
    post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(Post, id);
    return true;
  }
}
