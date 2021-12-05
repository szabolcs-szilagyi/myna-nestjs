import { agent } from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { assert, match, createSandbox } from 'sinon';
import { StockRepository } from './stock.repository';
import { PurchasedRepository } from './purchased.repository';
import { TokenService } from '../token/token.service';
import { TokenModule } from '../token/token.module';
import { AddressModule } from '../address/address.module';
import { AddressService } from '../address/address.service';
import { ProductModule } from '../product/product.module';
import { ProductRepository } from '../product/product.repository';
import { AddressEntity } from '../address/entities/address.entity';
import { SessionModule } from '../session/session.module';
import { SessionRepository } from '../session/session.repository';
import { PurchaseLogService } from '../purchase-log/purchase-log.service';
import { PurchaseLogModule } from '../purchase-log/purchase-log.module';
import { TransactionalRepositoryModule } from '../transactional-repository/transactional-repository.module';

const sandbox = createSandbox();

function getSessionIdFromCookie(cookie: string) {
  const decoded = decodeURIComponent(cookie);

  return decoded.match(/:(.*?)\./)[1];
}

describe('CartController', () => {
  let app: INestApplication;
  let cartRepo: CartRepository;
  let stockRepo: StockRepository;
  let purchasedRepo: PurchasedRepository;
  let productRepo: ProductRepository;

  const tokenService = {
    getEmailBySessionToken: sandbox.stub(),
  };
  const addressService = {
    getAddressDataByEmail: sandbox.stub(),
    getDeliveryCost: sandbox.stub(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgres://myna_test:test@127.0.0.1/myna_test',
          autoLoadEntities: true,
          synchronize: false,
        }),
        TypeOrmModule.forFeature([
          CartRepository,
          StockRepository,
          PurchasedRepository,
        ]),
        SessionModule,
        TransactionalRepositoryModule,
        PurchaseLogModule,
        TokenModule,
        AddressModule,
        ProductModule, // needed so that we can add products for test
      ],
      controllers: [CartController],
      providers: [CartService],
    })
      .overrideProvider(TokenService)
      .useValue(tokenService)
      .overrideProvider(AddressService)
      .useValue(addressService)
      .overrideProvider(PurchaseLogService)
      .useValue({
        recordPurchase: sandbox.stub().resolves(),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    cartRepo = app.get(CartRepository) as CartRepository;
    stockRepo = app.get(StockRepository) as StockRepository;
    purchasedRepo = app.get(PurchasedRepository) as PurchasedRepository;
    productRepo = app.get(ProductRepository) as ProductRepository;
  });

  afterAll(() => app.close());

  beforeEach(async () => {
    await cartRepo.delete({});
    await stockRepo.delete({});
    await purchasedRepo.delete({});
    await productRepo.delete({});

    sandbox.reset();
  });

  describe('POST cart', () => {
    it('requires session and product details', () => {
      return agent(app.getHttpServer()).post('/cart').expect(400);
    });

    it('able to add product using session token', async () => {
      const sessionToken = 'randomletters1324324';
      await agent(app.getHttpServer())
        .post('/cart')
        .set('session-token', sessionToken)
        .send(<AddToCartDto>{
          idName: 'something',
          size: 'XXL',
        })
        .expect(201, { success: '1' });

      const cartItemRecord = await cartRepo.find({ sessionToken });

      assert.match(cartItemRecord[0], { paid: match.falsy, sessionToken });
    });

    it('able to add product using session cookie', async () => {
      const idName = 'something-rand' + Math.floor(Math.random() * 1000);
      await agent(app.getHttpServer())
        .post('/cart')
        .send(<AddToCartDto>{
          idName,
          size: 'XXL',
        })
        .expect(201);

      const cartItemRecord = await cartRepo.findOne({ idName });

      assert.match(cartItemRecord, {
        paid: match.falsy,
        session: match.string,
      });
    });
  });

  describe('DELETE cart/:id', () => {
    it('requires session and product id', () => {
      return agent(app.getHttpServer()).delete('/cart/0').expect(400);
    });

    it('able to remove product from cart using token', async () => {
      const sessionToken = 'randomles1324324';
      await agent(app.getHttpServer())
        .post('/cart')
        .set('session-token', sessionToken)
        .send(<AddToCartDto>{
          idName: 'sotest',
          size: 'XL',
        })
        .expect(201, { success: '1' });

      const cartItemRecord = await cartRepo.findOne({ sessionToken });

      await agent(app.getHttpServer())
        .delete('/cart/' + cartItemRecord.id)
        .set('session-token', sessionToken)
        .expect(200, { success: '1' });
    });

    it('able to remove product from cart using session cookie', async () => {
      const requestAgent = agent(app.getHttpServer());
      const response = await requestAgent
        .post('/cart')
        .send(<AddToCartDto>{
          idName: 'sotest',
          size: 'XL',
        })
        .expect(201);

      const cookie = response.headers['set-cookie'];
      const sessionId = getSessionIdFromCookie(cookie[0]);
      const cartItemRecord = await cartRepo.findOne({ session: sessionId });

      await requestAgent.delete('/cart/' + cartItemRecord.id).expect(200);

      const cartItemRecordAfter = await cartRepo.findOne({
        session: sessionId,
      });
      expect(cartItemRecordAfter).toBeFalsy();
    });
  });

  describe('GET products-in-cart', () => {
    it('returns the correct products using session token', async () => {
      const sessionToken = 'rromelslsdkfe';
      await agent(app.getHttpServer())
        .post('/cart')
        .set('session-token', sessionToken)
        .send(<AddToCartDto>{
          idName: 'first',
          size: 'L',
        })
        .expect(201, { success: '1' });

      await agent(app.getHttpServer())
        .post('/cart')
        .set('session-token', sessionToken)
        .send(<AddToCartDto>{
          idName: 'second',
          size: 'L',
        })
        .expect(201, { success: '1' });

      await cartRepo.update({ sessionToken, idName: 'second' }, { paid: true });

      await agent(app.getHttpServer())
        .get('/cart/products-in-cart')
        .set('session-token', sessionToken)
        .expect(200)
        .then(({ body }) => {
          assert.match(body[0], { idName: 'first', size: 'L' });
        });
    });

    it('returns the correct products using session cookie', async () => {
      const agentInstance = agent(app.getHttpServer());
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{
          idName: 'first',
          size: 'L',
        })
        .expect(201);

      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{
          idName: 'second',
          size: 'L',
        })
        .expect(201);

      await cartRepo.update({ idName: 'second' }, { paid: true });

      await agentInstance
        .get('/cart/products-in-cart')
        .expect(200)
        .then(({ body }) => {
          assert.match(
            body[0],
            match({
              idName: 'first',
              size: 'L',
            }),
          );
          expect(body[0].session).toBeUndefined();
          expect(body[0].sessionToken).toBeUndefined();
          expect(body).toHaveLength(1);
        });
    });
  });

  describe('POST products-paid', () => {
    it('reduces stock levels', async () => {
      tokenService.getEmailBySessionToken.callsFake(
        async () => 'slkdjfslkdjfls',
      );
      const sessionToken = 'fdsafdsafdsa';
      await agent(app.getHttpServer())
        .post('/cart')
        .set('session-token', sessionToken)
        .send(<AddToCartDto>{ idName: 'first1', size: 's' })
        .expect(201, { success: '1' });

      await stockRepo.insert({ idName: 'first1', s: 5, m: 5 });
      await stockRepo.insert({ idName: 'second2', s: 5, m: 2 });

      await agent(app.getHttpServer())
        .post('/cart/products-paid')
        .set('session-token', sessionToken)
        .expect(201);

      const stockLevels = await stockRepo.find({ order: { id: 'ASC' } });

      assert.match(stockLevels, [
        match({ idName: 'first1', s: 4, m: 5 }),
        match({ idName: 'second2', s: 5, m: 2 }),
      ]);
    });

    it('set cart items that they have been paid using session token', async () => {
      tokenService.getEmailBySessionToken.callsFake(
        async () => 'slkdjfslkdjfls',
      );
      const sessionToken = 'fdsafdsalkjlkj';
      await agent(app.getHttpServer())
        .post('/cart')
        .set('session-token', sessionToken)
        .send(<AddToCartDto>{ idName: 'first2', size: 's' })
        .expect(201, { success: '1' });

      await stockRepo.insert({ idName: 'first2', s: 5, m: 5 });

      await agent(app.getHttpServer())
        .post('/cart/products-paid')
        .set('session-token', sessionToken)
        .expect(201);

      const cartContent = await cartRepo.getProductsInCart(sessionToken, null);
      const rawCartContent = await cartRepo.find({
        where: { sessionToken },
        order: { id: 'ASC' },
      });

      expect(cartContent.length).toEqual(0);
      assert.match(rawCartContent, [
        match({ sessionToken, paid: true, idName: 'first2' }),
      ]);
    });

    it('set cart items that they have been paid using session cookie', async () => {
      const agentInstance = agent(app.getHttpServer());
      const result = await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'first2', size: 's' })
        .expect(201);

      const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

      const sessionRepo = app.get(SessionRepository) as SessionRepository;
      const sessionObj = await sessionRepo.findOne({ id: session });
      sessionObj.setFieldInData('email', 'tests');

      await sessionRepo.save(sessionObj);

      await stockRepo.insert({ idName: 'first2', s: 5, m: 5 });

      await agentInstance.post('/cart/products-paid').expect(201);

      const cartContent = await cartRepo.getProductsInCart(null, session);
      const rawCartContent = await cartRepo.find({
        where: { session },
        order: { id: 'ASC' },
      });

      expect(cartContent.length).toEqual(0);
      assert.match(rawCartContent, [
        match({ session, paid: true, idName: 'first2' }),
      ]);
    });

    it('records the transaction in the purchased repo', async () => {
      tokenService.getEmailBySessionToken.callsFake(
        async () => 'slkdjfslkdjfls',
      );
      const sessionToken = 'fdsafeeeeeelkj';
      await agent(app.getHttpServer())
        .post('/cart')
        .set('session-token', sessionToken)
        .send(<AddToCartDto>{ idName: 'first3', size: 'm' })
        .expect(201, { success: '1' });

      await stockRepo.insert({ idName: 'first3', s: 5, m: 5 });

      await agent(app.getHttpServer())
        .post('/cart/products-paid')
        .set('session-token', sessionToken)
        .expect(201);

      const purchaseRecords = await purchasedRepo.find({ sessionToken });

      assert.calledOnce(tokenService.getEmailBySessionToken);
      expect(purchaseRecords.length).toEqual(1);
    });

    it('records transaction in the log', async () => {
      const agentInstance = agent(app.getHttpServer());
      const result = await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'first2', size: 's' })
        .expect(201);

      const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

      const sessionRepo = app.get(SessionRepository) as SessionRepository;
      const sessionObj = await sessionRepo.findOne({ id: session });
      sessionObj.setFieldInData('email', 'tests');

      const pruchaseLogService = app.get(
        PurchaseLogService,
      ) as PurchaseLogService;

      await sessionRepo.save(sessionObj);

      await stockRepo.insert({ idName: 'first2', s: 5, m: 5 });

      await agentInstance.post('/cart/products-paid').expect(201);

      assert.calledOnceWithMatch((pruchaseLogService as any).recordPurchase, [
        match({ idName: 'first2', size: 's' }),
      ]);
    });
  });

  describe('GET availability', () => {
    it('needs product idName', () => {
      return agent(app.getHttpServer())
        .get('/cart/availability')
        .query({ size: 'l' })
        .expect(400);
    });

    it('also needs size', () => {
      return agent(app.getHttpServer())
        .get('/cart/availability')
        .query({ idName: 'test-product' })
        .expect(400);
    });

    it('returns not found if asking for non-existent combo', () => {
      return agent(app.getHttpServer())
        .get('/cart/availability')
        .query({ idName: 'test-product', size: 'l' })
        .expect(404);
    });

    it('return the amount from the database', async () => {
      await stockRepo.insert({
        idName: 'exist',
        xs: 1,
        s: 2,
        m: 3,
        ml: 4,
        l: 5,
        oneSize: null,
      });

      return agent(app.getHttpServer())
        .get('/cart/availability')
        .query({ idName: 'exist', size: 'l' })
        .expect(200, { availability: 5 });
    });
  });

  describe('GET more-accurate-availability', () => {
    it('gives un-altered number if nothing in cart', async () => {
      await stockRepo.insert({
        idName: 'exist',
        xs: 1,
        s: 2,
        m: 3,
        ml: 4,
        l: 5,
        oneSize: null,
      });

      return agent(app.getHttpServer())
        .get('/cart/more-accurate-availability')
        .query({ idName: 'exist', size: 'l' })
        .expect(200, { availability: 5 });
    });

    it('reduces availability with the number of products in cart using session token', async () => {
      const sessionToken = '12312312434233e';
      await stockRepo.insert({
        idName: 'exist',
        xs: 1,
        s: 2,
        m: 3,
        ml: 4,
        l: 5,
        oneSize: 66,
      });
      await cartRepo.insert({
        amount: 2,
        idName: 'exist',
        size: 'onesize',
        paid: false,
        sessionToken,
      });

      return agent(app.getHttpServer())
        .get('/cart/more-accurate-availability')
        .set('session-token', sessionToken)
        .query({ idName: 'exist', size: 'oneSize' })
        .expect(200, { availability: 64 });
    });

    it('reduces availability with the number of products in cart using session cookie', async () => {
      await stockRepo.insert({
        idName: 'exist',
        xs: 1,
        s: 2,
        m: 3,
        ml: 4,
        l: 5,
        oneSize: 66,
      });
      const agentInstance = agent(app.getHttpServer());
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'exist', size: 'onesize' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'exist', size: 'onesize' })
        .expect(201);

      return agentInstance
        .get('/cart/more-accurate-availability')
        .query({ idName: 'exist', size: 'oneSize' })
        .expect(200, { availability: 64 });
    });

    it('will not reduce availability if different session token is given', async () => {
      await stockRepo.insert({
        idName: 'exist',
        xs: 1,
        s: 2,
        m: 3,
        ml: 4,
        l: 5,
        oneSize: 66,
      });
      await cartRepo.insert({
        amount: 2,
        idName: 'exist',
        size: 'onesize',
        paid: false,
        sessionToken: '12312312434233e',
      });

      return agent(app.getHttpServer())
        .get('/cart/more-accurate-availability')
        .set('session-token', 'somethingelse')
        .query({ idName: 'exist', size: 'oneSize' })
        .expect(200, { availability: 66 });
    });

    it('will not reduce availability if different session cookie is given', async () => {
      await stockRepo.insert({
        idName: 'exist',
        xs: 1,
        s: 2,
        m: 3,
        ml: 4,
        l: 5,
        oneSize: 66,
      });

      await agent(app.getHttpServer())
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'exist', size: 'onesize' })
        .expect(201);

      return agent(app.getHttpServer())
        .get('/cart/more-accurate-availability')
        .set('session-token', 'somethingelse')
        .query({ idName: 'exist', size: 'oneSize' })
        .expect(200, { availability: 66 });
    });
  });

  describe('GET total', () => {
    it('will calculate with zero delivery if email not set using session token', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 222,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });
      await cartRepo.insert({
        amount: 2,
        idName: 'my-awesome-product',
        paid: false,
        sessionToken: 'asdfasdf',
        size: 's',
      });

      tokenService.getEmailBySessionToken.resolves(undefined);

      await agent(app.getHttpServer())
        .get('/cart/total')
        .set('session-token', 'asdfasdf')
        .expect(200, { topay: 444, delivery: 0, products: 444 });

      assert.notCalled(addressService.getDeliveryCost);
    });

    it('will calculate with zero delivery if email not set using cookie', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 222,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });

      const agentInstance = agent(app.getHttpServer());
      const result = await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);

      const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

      const sessionRepo = app.get(SessionRepository) as SessionRepository;
      const sessionObj = await sessionRepo.findOne({ id: session });
      sessionObj.setFieldInData('email', 'tests');
      await sessionRepo.save(sessionObj);

      await agentInstance
        .get('/cart/total')
        .expect(200, { topay: 444, delivery: 0, products: 444 });

      assert.notCalled(addressService.getDeliveryCost);
    });

    it('will calculate with zero delivery if email is `nodata` using session token', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 222,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });
      await cartRepo.insert({
        amount: 4,
        idName: 'my-awesome-product',
        paid: false,
        sessionToken: 'asdfasdf',
        size: 's',
      });

      tokenService.getEmailBySessionToken.resolves('nodata');

      await agent(app.getHttpServer())
        .get('/cart/total')
        .set('session-token', 'asdfasdf')
        .expect(200, { topay: 888, delivery: 0, products: 888 });

      assert.notCalled(addressService.getDeliveryCost);
    });

    it('will calculate with zero delivery if email is `nodata` using session cookie', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 222,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });

      const agentInstance = agent(app.getHttpServer());

      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);

      await agentInstance
        .get('/cart/total')
        .expect(200, { topay: 888, delivery: 0, products: 888 });

      assert.notCalled(addressService.getDeliveryCost);
    });

    it('returns correct sum using session token', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 111,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });
      await cartRepo.insert({
        amount: 2,
        idName: 'my-awesome-product',
        paid: false,
        sessionToken: 'asdfasdf',
        size: 's',
      });

      tokenService.getEmailBySessionToken.resolves('wannabuy@hello.com');
      addressService.getAddressDataByEmail.resolves(<AddressEntity>{
        country: 'Poland',
      });
      addressService.getDeliveryCost.returns(10);

      return agent(app.getHttpServer())
        .get('/cart/total')
        .set('session-token', 'asdfasdf')
        .expect(200, { topay: 232, delivery: 10, products: 222 });
    });

    it('returns correct sum using session cookie', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 111,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });

      const agentInstance = agent(app.getHttpServer());
      const result = await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);

      const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

      const sessionRepo = app.get(SessionRepository) as SessionRepository;
      const sessionObj = await sessionRepo.findOne({ id: session });
      sessionObj.setFieldInData('email', 'tests');
      sessionObj.setFieldInData('country', 'Poland');
      await sessionRepo.save(sessionObj);

      addressService.getDeliveryCost.returns(10);

      return agentInstance
        .get('/cart/total')
        .expect(200, { topay: 232, delivery: 10, products: 222 });
    });

    it('returns correct sum even if the same session already bought items (token)', async () => {
      await productRepo.insert({
        idName: 'my-good-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 111,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });
      await cartRepo.insert({
        amount: 2,
        idName: 'my-good-product',
        paid: false,
        sessionToken: 'asdfasdf',
        size: 's',
      });
      await cartRepo.insert({
        amount: 2,
        idName: 'my-good-product',
        paid: true,
        sessionToken: 'asdfasdf',
        size: 's',
      });

      tokenService.getEmailBySessionToken.resolves('wannabuy@hello.com');
      addressService.getAddressDataByEmail.resolves(<AddressEntity>{
        country: 'Poland',
      });
      addressService.getDeliveryCost.returns(10);

      return agent(app.getHttpServer())
        .get('/cart/total')
        .set('session-token', 'asdfasdf')
        .expect(200, { topay: 232, delivery: 10, products: 222 });
    });

    it('returns correct sum even if the same session already bought items (cookie)', async () => {
      await productRepo.insert({
        idName: 'my-good-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 111,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });

      const agentInstance = agent(app.getHttpServer());
      const result = await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-good-product', size: 's' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-good-product', size: 's' })
        .expect(201);

      const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

      await cartRepo.insert({
        amount: 2,
        idName: 'my-good-product',
        paid: true,
        session,
        sessionToken: session,
        size: 's',
      });

      const sessionRepo = app.get(SessionRepository) as SessionRepository;
      const sessionObj = await sessionRepo.findOne({ id: session });
      sessionObj.setFieldInData('email', 'tests');
      sessionObj.setFieldInData('country', 'Poland');
      await sessionRepo.save(sessionObj);

      addressService.getDeliveryCost.returns(10);

      return agentInstance
        .get('/cart/total')
        .expect(200, { topay: 232, delivery: 10, products: 222 });
    });

    it('ignores invalid coupon (token)', async () => {
      const sessionToken = '654323456543';
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 333,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });
      await cartRepo.insert({
        amount: 2,
        idName: 'my-awesome-product',
        paid: false,
        sessionToken,
        size: 's',
      });

      tokenService.getEmailBySessionToken.resolves('wannabuy@hello.com');
      addressService.getAddressDataByEmail.resolves(<AddressEntity>{
        country: 'Poland',
      });
      addressService.getDeliveryCost.returns(10);

      return agent(app.getHttpServer())
        .get('/cart/total')
        .set('session-token', sessionToken)
        .set('coupon', 'my-fake-coupon20')
        .expect(200, { topay: 676, delivery: 10, products: 666 });
    });

    it('ignores invalid coupon (cookie)', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 333,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });

      const agentInstance = agent(app.getHttpServer());
      const result = await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);
      await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);

      const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

      const sessionRepo = app.get(SessionRepository) as SessionRepository;
      const sessionObj = await sessionRepo.findOne({ id: session });
      sessionObj.setFieldInData('email', 'tests');
      sessionObj.setFieldInData('country', 'Poland');
      await sessionRepo.save(sessionObj);

      addressService.getDeliveryCost.returns(10);

      return agentInstance
        .get('/cart/total')
        .set('coupon', 'my-fake-coupon20')
        .expect(200, { topay: 676, delivery: 10, products: 666 });
    });

    it('reduces the price if coupon is valid (token)', async () => {
      const sessionToken = '654323456543';
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 100,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });
      await cartRepo.insert({
        amount: 1,
        idName: 'my-awesome-product',
        paid: false,
        sessionToken,
        size: 's',
      });

      tokenService.getEmailBySessionToken.resolves('wannabuy@hello.com');
      addressService.getAddressDataByEmail.resolves(<AddressEntity>{
        country: 'Poland',
      });
      addressService.getDeliveryCost.returns(10);

      return agent(app.getHttpServer())
        .get('/cart/total')
        .set('session-token', sessionToken)
        .set('coupon', 'mynafriend10')
        .expect(200, { topay: 100, delivery: 10, products: 90 });
    });

    it('reduces the price if coupon is valid (cookie)', async () => {
      await productRepo.insert({
        idName: 'my-awesome-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 100,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'that.png',
      });

      const agentInstance = agent(app.getHttpServer());
      const result = await agentInstance
        .post('/cart')
        .send(<AddToCartDto>{ idName: 'my-awesome-product', size: 's' })
        .expect(201);

      const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

      const sessionRepo = app.get(SessionRepository) as SessionRepository;
      const sessionObj = await sessionRepo.findOne({ id: session });
      sessionObj.setFieldInData('email', 'tests');
      sessionObj.setFieldInData('country', 'Poland');
      await sessionRepo.save(sessionObj);

      addressService.getDeliveryCost.returns(10);

      return agentInstance
        .get('/cart/total')
        .set('coupon', 'mynafriend10')
        .expect(200, { topay: 100, delivery: 10, products: 90 });
    });
  });
});
