import { MikroORM } from '@mikro-orm/core';
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
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const em = await orm.em.fork();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  await redisClient.connect().catch(console.error);

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
        secure: false, //change in prod!
      },
      secret: process.env.SECRET!,
      saveUninitialized: false,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    plugins: [
      //remove plugins in prod!!
      ApolloServerPluginLandingPageLocalDefault({
        footer: false,
        includeCookies: true,
      }),
    ],
  });
  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res, em }), //lets resolvers use whatever i pass
    })
  );

  app.listen(process.env.PORT, () => {
    console.log('-------------------------RUNNING-------------------------');
  });
})().catch((err) => {
  console.error(err);
});
