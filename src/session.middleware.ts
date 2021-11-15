import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import * as PgSession from 'connect-pg-simple';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'pg';

const {
  NODE_ENV,
  SESSION_SECRET = 'my-super-secret-dev-secret-66',
} = process.env;

const devEnv = new Set([undefined, 'dev', 'development']);
const isDevelopmentEnv = devEnv.has(NODE_ENV);
const cookieDomain = isDevelopmentEnv ? 'localhost' : 'mynalabel.com';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(@InjectConnection() private connection: Connection) {}

  use(req: Request, res: Response, next: NextFunction) {
    const SessionStorage = new PgSession(session);
    session({
      store: new SessionStorage({
        pool: this.connection,
      }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      name: `${NODE_ENV || 'development'}-myna`,
      cookie: {
        domain: cookieDomain,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: isDevelopmentEnv,
        secure: !isDevelopmentEnv,
      },
    })(req, res, next);
  }
}
