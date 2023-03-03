import { Request, Response } from 'express';
import {
  AbstractSqlConnection,
  AbstractSqlDriver,
  AbstractSqlPlatform,
  EntityManager,
} from '@mikro-orm/postgresql';

export type MyContext = {
  em: EntityManager<
    AbstractSqlDriver<AbstractSqlConnection, AbstractSqlPlatform>
  >;
  req: Request;
  res: Response;
};

declare module 'express-session' {
  interface Session {
    userId?: number;
  }
}
