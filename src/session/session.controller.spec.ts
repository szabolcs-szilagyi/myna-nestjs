import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDataDto } from './user-data.dto';
import { agent } from 'supertest';
import { SessionRepository } from './session.repository';
import { SessionModule } from './session.module';
import { assert, createSandbox, match } from 'sinon';

describe('SessionController', () => {
  let app: INestApplication;
  const sandbox = createSandbox();

  beforeAll(async () => {
    const sessionRepositoryStub = {
      save: sandbox.stub().resolves(),
      update: sandbox.stub().resolves(undefined),
      delete: sandbox.stub().resolves(undefined),
      clear: sandbox.stub().resolves(undefined),
      count: sandbox.stub().resolves(undefined),
      find: sandbox.stub().resolves([]),
      destroy: sandbox.stub().resolves(undefined),
      findOne: sandbox.stub().resolves(undefined),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [SessionModule],
    })
      .overrideProvider(SessionRepository)
      .useValue(sessionRepositoryStub)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  afterEach(() => sandbox.resetHistory());

  describe('POST save-user-details', () => {
    it('will not save empty user data', () => {
      return agent(app.getHttpServer()).post('/session').expect(400);
    });

    it('will not accept partial info', () => {
      return agent(app.getHttpServer())
        .post('/session')
        .send(<UserDataDto>{
          name: 'sir yoloo',
        })
        .expect(400);
    });

    it('accepts and saves valid data', async () => {
      await agent(app.getHttpServer())
        .post('/session')
        .send(<UserDataDto>{
          name: 'sir yoloo',
          email: 'asdf@asdf',
          mobile: '123',
          addressLine1: '',
          addressLine2: '',
          city: '',
          country: '',
          comment: '',
          state: '',
          zip: '',
        })
        .expect(201);

      assert.calledOnceWithMatch((app.get(SessionRepository) as any).save, {
        data: match(
          JSON.stringify({
            name: 'sir yoloo',
            email: 'asdf@asdf',
            mobile: '123',
            addressLine1: '',
            addressLine2: '',
            city: '',
            country: '',
            comment: '',
            state: '',
            zip: '',
          }).slice(1, -1),
        ),
      });
    });
  });

  describe('GET valid session', () => {
    it('returns falsy for validity', async () => {
      const agentInstance = agent(app.getHttpServer());

      const { body } = await agentInstance.get('/session/is-valid').expect(200);

      expect(body).toEqual({ isValid: false });
    });

    it('gives successful response if the session is filled with delivery details', async () => {
      const sessionRepo = app.get(SessionRepository) as any;

      sessionRepo.findOne.resolves({
        data: JSON.stringify({
          name: 'asdf',
          email: 'asdf@asdf',
          mobile: '123',
          addressLine1: 'asdf',
          city: 'tad',
          country: 'asd',
          state: 'aggf',
          zip: '1234',
          cookie: {
            path: '/',
            _expires: new Date().toISOString(),
            originalMaxAge: 86400000,
            httpOnly: true,
            domain: undefined,
            secure: false,
          },
        }),
      });

      const agentInstance = agent(app.getHttpServer());

      await agentInstance
        .post('/session')
        .send(<UserDataDto>{
          name: 'sir yoloo',
          email: 'asdf@asdf',
          mobile: '123',
          addressLine1: 'asdf',
          addressLine2: '',
          city: 'tad',
          country: 'asd',
          comment: '',
          state: 'aggf',
          zip: '1234',
        })
        .expect(201);

      const { body } = await agentInstance.get('/session/is-valid').expect(200);

      expect(body).toEqual({ isValid: true });
    });
  });
});
