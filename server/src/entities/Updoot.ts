import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Post } from './Post';
import { User } from './User';

@Entity()
export class Updoot {
  @Property({ type: 'int' })
  value: number;

  @ManyToOne(() => User, { primary: true })
  user: User;

  @ManyToOne(() => Post, { primary: true })
  post: Post;
}
