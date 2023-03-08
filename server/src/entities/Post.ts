import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { ObjectType, Field, Int } from 'type-graphql';
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

  @OneToMany(() => Updoot, (updoot) => updoot.post, { default: [] })
  updoots = new Collection<Updoot>(this);

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Field(() => Int, { nullable: true })
  voteStatus?: number | undefined;
}
