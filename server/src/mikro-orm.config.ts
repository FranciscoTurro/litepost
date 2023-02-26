import { Post } from './entities/Post';
import { MikroORM } from '@mikro-orm/core';

export default {
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  entities: [Post],
  dbName: 'litepost',
  type: 'postgresql',
  debug: true,
  user: 'postgres',
  password: 'postgres',
} as Parameters<typeof MikroORM.init>[0];
