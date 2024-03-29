import * as supertest from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from '../token/token.service';
import { AddressService } from '../address/address.service';
import { AddressController } from '../address/address.controller';
import { AddressRepository } from './address.repository';
import { LoginTokenRepository } from '../token/login-token.repository';
import { SessionTokenRepository } from '../token/session-token.repository';
import { AddressEntity } from './entities/address.entity';
import { AddressDataDto } from './dto/address-data.dto';
import { assert, createSandbox } from 'sinon';
import { omit } from 'lodash/fp';
import { SessionRepository } from '../session/session.repository';
import { SessionModule } from '../session/session.module';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';

describe('AddressController', () => {
  let app: INestApplication;
  let oldSessionRepo: SessionTokenRepository;
  let addressRepo: AddressRepository;
  const sandbox = createSandbox();

  beforeAll(async () => {
    const sessionRepositoryStub = {
      save: sandbox.stub().resolves({}),
      update: sandbox.stub().resolves(undefined),
      delete: sandbox.stub().resolves(undefined),
      clear: sandbox.stub().resolves(undefined),
      count: sandbox.stub().resolves(undefined),
      find: sandbox.stub().resolves([]),
      destroy: sandbox.stub().resolves(undefined),
      findOne: sandbox.stub().resolves(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgres://myna_test:test@127.0.0.1/myna_test',
          autoLoadEntities: true,
          synchronize: false,
        }),
        TypeOrmModule.forFeature([
          AddressRepository,
          LoginTokenRepository,
          SessionTokenRepository,
        ]),
        SessionModule,
        CartModule,
        ProductModule,
      ],
      controllers: [AddressController],
      providers: [AddressService, TokenService],
    })
      .overrideProvider(SessionRepository)
      .useValue(sessionRepositoryStub)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    oldSessionRepo = app.get(SessionTokenRepository) as SessionTokenRepository;
    addressRepo = app.get(AddressRepository) as AddressRepository;
  });

  afterAll(() => app.close());

  beforeEach(async () => {
    await oldSessionRepo.delete({});
    await addressRepo.delete({});
  });

  afterEach(() => sandbox.resetHistory());

  describe('GET shipping-info', () => {
    it('returns default text if no session available', () => {
      return supertest(app.getHttpServer())
        .get('/address/shipping-info')
        .expect(200, { shippinginfo: 'Plus shipping fee' });
    });

    it('for EU countries shipping is 10 EUR using token', async () => {
      const sessionToken = 'asdfasdfasdfasdfasdfasd';
      const email = 'test@e-mail.hu';

      await oldSessionRepo.insert({
        email,
        sessionToken,
        createTime: new Date(),
      });

      await addressRepo.insert({
        country: 'austria',
        type: true,
        email,
        sessionToken,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
        comment: '',
        mobile: '',
      });

      return supertest(app.getHttpServer())
        .get('/address/shipping-info')
        .set('session-token', sessionToken)
        .expect(200, { shippinginfo: 'incl. €10 shipping fee (EU)' });
    });

    it('for EU countries shipping is 10 EUR using cookie', async () => {
      const sessionRepo = app.get(SessionRepository) as any;

      sessionRepo.findOne.resolves({
        data: JSON.stringify({
          name: 'asdf',
          email: 'asdf@asdf',
          country: 'austria',
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

      const agentInstance = supertest.agent(app.getHttpServer());

      await agentInstance.get('/address/shipping-info').expect(200);

      return agentInstance
        .get('/address/shipping-info')
        .expect(200, { shippinginfo: 'incl. €10 shipping fee (EU)' });
    });

    it('for non-EU countries shipping is 25 EUR using token', async () => {
      const sessionToken = 'asdfasdfasdfasdfasdfasd';
      const email = 'test@e-mail.hu';

      await oldSessionRepo.insert({
        email,
        sessionToken,
        createTime: new Date(),
      });

      await addressRepo.insert({
        country: 'australia',
        type: true,
        email,
        sessionToken,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
        comment: '',
        mobile: '',
      });

      return supertest(app.getHttpServer())
        .get('/address/shipping-info')
        .set('session-token', sessionToken)
        .expect(200, { shippinginfo: 'incl. €25 shipping fee (Non-EU)' });
    });

    it('for non-EU countries shipping is 25 EUR using cookie', async () => {
      const sessionRepo = app.get(SessionRepository) as any;

      sessionRepo.findOne.resolves({
        data: JSON.stringify({
          name: 'asdf',
          email: 'asdf@asdf',
          country: 'australia',
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

      const agentInstance = supertest.agent(app.getHttpServer());

      await agentInstance.get('/address/shipping-info').expect(200);

      return agentInstance
        .get('/address/shipping-info')
        .expect(200, { shippinginfo: 'incl. €25 shipping fee (Non-EU)' });
    });

    it('for Poland its free shipping using token', async () => {
      const sessionToken = 'asdfasdfasdfasdfasdfasd';
      const email = 'test@e-mail.hu';

      await oldSessionRepo.insert({
        email,
        sessionToken,
        createTime: new Date(),
      });

      await addressRepo.insert({
        country: 'poland',
        type: true,
        email,
        sessionToken,
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
        comment: '',
        mobile: '',
      });

      return supertest(app.getHttpServer())
        .get('/address/shipping-info')
        .set('session-token', sessionToken)
        .expect(200, { shippinginfo: 'incl. free shipping' });
    });

    it('for Poland its free shipping using cookie', async () => {
      const sessionRepo = app.get(SessionRepository) as any;

      sessionRepo.findOne.resolves({
        data: JSON.stringify({
          name: 'asdf',
          email: 'asdf@asdf',
          country: 'poland',
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

      const agentInstance = supertest.agent(app.getHttpServer());

      await agentInstance.get('/address/shipping-info').expect(200);

      return agentInstance
        .get('/address/shipping-info')
        .expect(200, { shippinginfo: 'incl. free shipping' });
    });
  });

  describe('GET address-data', () => {
    it('should return default empty data', () => {
      return supertest(app.getHttpServer())
        .get('/address/address-data')
        .expect(200, {});
    });

    it('should return correct address data connected to session and email', async () => {
      const sessionToken = 'aaasdfasdfasdf';
      const email = 'heldxo@lldf.kl';

      const addressData: Partial<AddressEntity> = {
        addressLine1: 'line 1',
        addressLine2: 'line 2',
        city: 'good city',
        comment: '1',
        country: 'loli',
        email,
        mobile: '2342343243',
        name: 'helel lelel',
        sessionToken,
        type: true,
        state: '',
        zip: '3242-23',
      };

      await oldSessionRepo.insert({
        email,
        sessionToken,
        createTime: new Date(),
      });
      await addressRepo.insert(addressData);

      return supertest(app.getHttpServer())
        .get('/address/address-data')
        .set('session-token', sessionToken)
        .set('email', email)
        .expect(200, {
          type: true,
          addressLine1: addressData.addressLine1,
          addressLine2: addressData.addressLine2,
          city: addressData.city,
          state: addressData.state,
          zip: addressData.zip,
          country: addressData.country,
          comment: addressData.comment,
          mobile: addressData.mobile,
        });
    });
  });

  describe('POST address-data', () => {
    it('returns success false if details are not correct', () => {
      return supertest(app.getHttpServer())
        .post('/address/address-data')
        .expect(201, { success: false });
    });

    it('returns success true if details saved', async () => {
      const sessionToken = '123edswedsww2343234';
      const addressData: AddressDataDto = {
        name: 'teszt elek',
        mobile: '0034234432432432',
        email: 'test@tele.k',
        addressLine1: 'line 2 1 2',
        addressLine2: 'line 1 2 1',
        city: 'Yemen',
        country: 'Dontknow',
        state: '',
        comment: 'dog barks',
        zip: '123-123',
        type: true,
      };

      await oldSessionRepo.insert({
        email: addressData.email,
        sessionToken,
        createTime: new Date(),
      });

      return supertest(app.getHttpServer())
        .post('/address/address-data')
        .set('session-token', sessionToken)
        .send(addressData)
        .expect(201, { success: true });
    });

    it('should be able to save and retrieve data', async () => {
      const sessionToken = '123edswedsww2343234';
      const addressData: AddressDataDto = {
        name: 'teszt elek',
        mobile: '0034234432432432',
        email: 'test@tele.k',
        addressLine1: 'line 2 1 2',
        addressLine2: 'line 1 2 1',
        city: 'Yemen',
        country: 'Dontknow',
        state: '',
        comment: 'dog barks',
        zip: '123-123',
        type: true,
      };

      await oldSessionRepo.insert({
        email: addressData.email,
        sessionToken,
        createTime: new Date(),
      });

      await supertest(app.getHttpServer())
        .post('/address/address-data')
        .set('session-token', sessionToken)
        .send(addressData)
        .expect(201, { success: true });

      return supertest(app.getHttpServer())
        .get('/address/address-data')
        .set('session-token', sessionToken)
        .set('email', addressData.email)
        .expect(200)
        .then(({ body }) => {
          assert.match(
            body,
            omit(['name', 'email', 'sessionToken'], addressData),
          );
        });
    });
  });
});
