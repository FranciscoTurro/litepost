import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { ObjectType, Field, Int } from 'type-graphql';
import { Comment } from './Comment';
import { Post } from './Post';
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  _id!: number;

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;

  @Property()
  password!: string; //remove the field property, graphql cant see it

  @OneToMany(() => Post, (post) => post.creator)
  posts = new Collection<Post>(this);

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots = new Collection<Updoot>(this);

  @OneToMany(() => Comment, (comment) => comment.user)
  comments = new Collection<Comment>(this);

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();
}
