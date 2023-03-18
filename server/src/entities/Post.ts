import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core';
import { ObjectType, Field, Int } from 'type-graphql';
import { Comment } from './Comment';
import { Updoot } from './Updoot';
import { User } from './User';

@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  _id!: number;

  @Field()
  @Property()
  title!: string;

  @Field()
  @Property()
  text?: string;

  @Field()
  @Property({ type: 'int', default: 0 })
  points?: number;

  @Field()
  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => Updoot, (updoot) => updoot.post, {
    cascade: [Cascade.REMOVE],
    default: [],
  })
  updoots = new Collection<Updoot>(this);

  @OneToMany(() => Comment, (comment) => comment.post, {
    cascade: [Cascade.REMOVE],
    default: [],
  })
  comments = new Collection<Comment>(this);

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => Int, { nullable: true })
  voteStatus?: number | undefined;
}
