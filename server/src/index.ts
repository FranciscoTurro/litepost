import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import mikroOrmConfig from './mikro-orm.config';
import express, { json } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';
import session from 'express-session';
import { CommentResolver } from './resolvers/comment';

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const em = (await orm.em.fork()) as EntityManager;

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL!,
    username: process.env.REDISUSER!,
    password: process.env.REDISPASSWORD!,
    socket: {
      host: process.env.REDISHOST!,
      port: parseInt(process.env.REDISPORT!),
    },
  });
  await redisClient.connect().catch(console.error);

  app.set('trust proxy', 1);

  app.use(
    session({
      name: process.env.COOKIE_NAME!,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        domain: '.railway.app',
      },
      secret: process.env.SECRET!,
      saveUninitialized: false,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver, CommentResolver],
      validate: false,
    }),
  });
  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: 'https://litepost-production.up.railway.app',
      credentials: true,
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res, em }), //lets resolvers use whatever i pass
    })
  );

  app.listen(process.env.PORT, () => {
    console.log('RUNNING');
  });
})().catch((err) => {
  console.error(err);
});
