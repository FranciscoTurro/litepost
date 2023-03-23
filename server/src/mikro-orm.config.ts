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
  debug: false,
  type: 'postgresql',
  host: process.env.PGHOST!,
  port: parseInt(process.env.PGPORT!),
  user: process.env.PGUSER!,
  password: process.env.PGPASSWORD!,
  dbName: 'railway',
} as Parameters<typeof MikroORM.init>[0];
