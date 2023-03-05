import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Post';
import { User } from './entities/User';
import dotenv from 'dotenv';
import { Updoot } from './entities/Updoot';

dotenv.config();

export default {
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  entities: [Post, User, Updoot],
  dbName: 'litepost',
  type: 'postgresql',
  debug: true, //change in prod!
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
} as Parameters<typeof MikroORM.init>[0];
