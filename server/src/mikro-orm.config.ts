import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Post';
import { User } from './entities/User';

export default {
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  entities: [Post, User],
  dbName: 'litepost',
  type: 'postgresql',
  debug: true,
  user: 'postgres', //!!!!!!!!!
  password: 'postgres', //!!!!!!!!!
} as Parameters<typeof MikroORM.init>[0];
