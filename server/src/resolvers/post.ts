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
  ObjectType,
} from 'type-graphql';
import { MyContext } from '../types/types';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { Loaded } from '@mikro-orm/core';
import { Updoot } from '../entities/Updoot';

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text?.slice(0, 50);
  }

  @FieldResolver(() => String)
  async voteStatus(@Root() post: Post, @Ctx() { req, em }: MyContext) {
    if (!req.session.userId) return null;
    const user = await em.findOne(User, req.session.userId);

    const updoot = await em.findOne(Updoot, { user, post });

    return updoot ? updoot.value : null;
  }

  @Query(() => PaginatedPosts)
  async getPosts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { em }: MyContext
  ): Promise<PaginatedPosts> {
    const cappedLimit = Math.min(50, limit);
    const cappedLimitPlusOne = cappedLimit + 1;
    let cursorValue;
    let posts: Loaded<Post, never>[];

    if (cursor) {
      cursorValue = new Date(parseInt(cursor));

      posts = await em.find(
        Post,
        { createdAt: { $lt: cursorValue } },
        {
          orderBy: { createdAt: 'DESC' },
          limit: cappedLimitPlusOne,
          populate: ['creator'] as const,
        }
      );
    } else {
      posts = await em.find(
        Post,
        {},
        {
          orderBy: { createdAt: 'DESC' },
          limit: cappedLimitPlusOne,
          populate: ['creator'] as const,
        }
      );
    }

    return {
      posts: posts.slice(0, cappedLimit),
      hasMore: posts.length === cappedLimitPlusOne,
    };
  }

  @Query(() => Post, { nullable: true })
  getPost(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, id, { populate: ['creator'] as const });
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

    user.posts.add(post);
    await em.persistAndFlush(user);

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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { em, req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const updootValue = isUpdoot ? 1 : -1;

    const user = await em.findOne(User, req.session.userId!);
    if (!user) return false;

    const post = await em.findOne(Post, postId);
    if (!post) return false;

    const existingUpdoot = await em.findOne(Updoot, { user, post });

    if (existingUpdoot && existingUpdoot.value !== updootValue) {
      //updoot already exists and the user changed its value
      existingUpdoot.value = updootValue;
      await em.persistAndFlush(existingUpdoot);

      post.points = post.points! + updootValue * 2;
      await em.persistAndFlush(post);
    } else if (existingUpdoot && existingUpdoot.value === updootValue) {
      //updoot exists and user clicked on the same value, so the updoot gets removed
      post.points = post.points! - updootValue;
      await em.persistAndFlush(post);

      await em.removeAndFlush(existingUpdoot);
    } else if (!existingUpdoot) {
      //updoot doesnt exist
      const updoot = em.create(Updoot, {
        post,
        user,
        value: updootValue,
      });
      await em.persistAndFlush(updoot);

      post.points! += updootValue;
      post.updoots.add(updoot);
      await em.persistAndFlush(post);

      user.updoots.add(updoot);
      await em.persistAndFlush(user);
    }

    return true;
  }
}
