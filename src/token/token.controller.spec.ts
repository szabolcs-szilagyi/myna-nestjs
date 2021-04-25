import { agent } from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../token/token.service';
import { LoginTokenRepository } from '../token/login-token.repository';
import { SessionTokenRepository } from '../token/session-token.repository';
import { TokenController } from './token.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { assert, match } from 'sinon';

describe('TokenController', () => {
  let app: INestApplication;
  let sessionRepo: SessionTokenRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: '127.0.0.1',
          port: 3306,
          username: 'myna_test',
          password: 'test',
          database: 'myna_test',
          autoLoadEntities: true,
          synchronize: false,
        }),
        TypeOrmModule.forFeature([
          LoginTokenRepository,
          SessionTokenRepository,
          UserRepository,
        ]),
      ],
      controllers: [TokenController],
      providers: [
        TokenService,
        UserService,
      ],
    })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    sessionRepo = app.get(SessionTokenRepository) as SessionTokenRepository;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await sessionRepo.delete({});
  })

  describe('GET get-email', () => {

    it('returns default empty value for no session', async () => {
      return agent(app.getHttpServer())
        .get('/token/get-email')
        .expect(200, { email: null })
    });

    it('returns the e-mail belonging to the session', async () => {
      const email = 'tuto@ges.hi';
      const sessionToken = 'lkasjdfl;aksjdf;aksjdf;lakj';
      await sessionRepo.insert({ email, sessionToken, createTime: new Date() })

      return agent(app.getHttpServer())
        .get('/token/get-email')
        .set('session-token', sessionToken)
        .expect(200, { email })
    });
  })

  describe('GET session', () => {
    it('returns a new session token', async () => {
      const { body } = await agent(app.getHttpServer())
        .get('/token/session')
        .expect(200);

      assert.match(body, { sessiontoken: match.string })
    });
  });
});
