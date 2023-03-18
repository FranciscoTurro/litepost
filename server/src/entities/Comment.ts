import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';
import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity()
export class Comment {
  @Field(() => Int)
  @PrimaryKey()
  _id!: number;

  @Field()
  @Property({ type: 'string' })
  text: string;

  @Field()
  @ManyToOne(() => User)
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post)
  post: Post;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();
}
