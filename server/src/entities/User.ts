import { Entity, PrimaryKey, Property, OneToMany } from '@mikro-orm/core';
import { ObjectType, Field, Int } from 'type-graphql';
import { Post } from './Post';

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
  posts?: Post[];

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt? = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt? = new Date();
}
