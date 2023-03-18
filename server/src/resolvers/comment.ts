import { Loaded } from '@mikro-orm/core';
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
import { User } from '../entities/User';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types/types';

@ObjectType()
class PaginatedComments {
  @Field(() => [Comment])
  comments: Comment[];
  @Field()
  hasMore: boolean;
}

@Resolver(Comment)
export class CommentResolver {
  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg('postId', () => Int) postId: number,
    @Arg('text', () => String) text: string,
    @Ctx() { em, req }: MyContext
  ): Promise<Comment> {
    const user = await em.findOne(User, req.session.userId!);
    if (!user) throw new Error('User doesnt exist');

    const post = await em.findOne(Post, postId);
    if (!post) throw new Error('Post doesnt exist');

    const comment = em.create(Comment, { post, user, text });

    await em.persistAndFlush(comment);

    return comment;
  }

  @Query(() => PaginatedComments)
  async getComments(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { em }: MyContext
  ): Promise<PaginatedComments> {
    const cappedLimit = Math.min(50, limit);
    const cappedLimitPlusOne = cappedLimit + 1;
    let cursorValue;
    let comments: Loaded<Comment, never>[];

    if (cursor) {
      cursorValue = new Date(parseInt(cursor));

      comments = await em.find(
        Comment,
        { createdAt: { $lt: cursorValue } },
        {
          orderBy: { createdAt: 'DESC' },
          limit: cappedLimitPlusOne,
          populate: ['post', 'user'] as const,
        }
      );
    } else {
      comments = await em.find(
        Comment,
        {},
        {
          orderBy: { createdAt: 'DESC' },
          limit: cappedLimitPlusOne,
          populate: ['post', 'user'] as const,
        }
      );
    }

    return {
      comments: comments.slice(0, cappedLimit),
      hasMore: comments.length === cappedLimitPlusOne,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg('id', () => Int) id: number,
    @Ctx() { em, req }: MyContext
  ): Promise<Boolean> {
    const comment = await em.findOne(Comment, id);
    if (!comment) return false;
    if (comment.user._id !== req.session.userId) return false;
    await em.remove(comment).flush();
    return true;
  }
}
