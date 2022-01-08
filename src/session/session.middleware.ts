import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as session from 'express-session';
import { TypeormStore } from 'typeorm-store';
import { SessionRepository } from './session.repository';

const {
  NODE_ENV,
  SESSION_SECRET = 'my-super-secret-dev-secret-66',
} = process.env;

const devEnv = new Set([undefined, 'dev', 'development', 'test']);
const isDevelopmentEnv = devEnv.has(NODE_ENV);

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private readonly store: TypeormStore;
  constructor(private readonly sessionRepo: SessionRepository) {
    this.store = new TypeormStore({
      repository: this.sessionRepo,
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    let cookieDomain = 'mynalabel.com';
    if (isDevelopmentEnv) {
      cookieDomain = undefined;
    } else if (/\.?mynalabel.com$/.test(req.hostname)) {
      cookieDomain = req.hostname;
    }

    session({
      store: this.store,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      name: `${NODE_ENV || 'development'}-myna`,
      cookie: {
        domain: cookieDomain,
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: isDevelopmentEnv,
        secure: false,
      },
    })(req, res, next);
  }

  onModuleDestroy() {
    this.store.clearExpirationInterval();
  }
}
