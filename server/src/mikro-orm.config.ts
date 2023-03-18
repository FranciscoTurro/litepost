import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { Comment } from './entities/Comment';
import { Updoot } from './entities/Updoot';
import dotenv from 'dotenv';

dotenv.config();

export default {
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  entities: [Post, User, Updoot, Comment],
  dbName: 'litepost',
  type: 'postgresql',
  debug: true, //change in prod!
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
} as Parameters<typeof MikroORM.init>[0];
