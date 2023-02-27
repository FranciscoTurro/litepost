import { MikroORM } from '@mikro-orm/core';
import dotenv from 'dotenv';
import mikroOrmConfig from './mikro-orm.config';
import express, { json } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';

dotenv.config();

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();
  const em = await orm.em.fork();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
  });
  await apolloServer.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer, {
      context: async () => ({ em }), //lets resolvers use whatever i pass
    })
  );

  app.listen(process.env.PORT, () => {
    console.log('WORKING-------------------------');
  });
})().catch((err) => {
  console.error(err);
});
