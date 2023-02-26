import { MikroORM } from '@mikro-orm/core';
import dotenv from 'dotenv';
import { Post } from './entities/Post';
import mikroOrmConfig from './mikro-orm.config';

dotenv.config();
(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  const em = await orm.em.fork();

  const post = em.create(Post, { title: 'post 1' });
  await em.persistAndFlush(post);
  console.log('inserted1=1=1=1=1=1=1==');
})().catch((err) => {
  console.error(err);
});
