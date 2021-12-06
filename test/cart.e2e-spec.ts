import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';
import { AppModule } from './../src/app.module';
import { AddToCartDto } from '../src/cart/dto/add-to-cart.dto';
import { SessionRepository } from '../src/session/session.repository';
import { assert, createSandbox, match } from 'sinon';
import { CartRepository } from '../src/cart/cart.repository';
import { StockRepository } from '../src/cart/stock.repository';
import { PurchasedRepository } from '../src/cart/purchased.repository';
import { ProductRepository } from '../src/product/product.repository';
import { PurchaseLogRepository } from '../src/purchase-log/purchase-log.repository';

const sandbox = createSandbox();

function getSessionIdFromCookie(cookie: string) {
  const decoded = decodeURIComponent(cookie);

  return decoded.match(/:(.*?)\./)[1];
}

describe('Cart (e2e)', () => {
  let app: INestApplication;
  let cartRepo: CartRepository;
  let stockRepo: StockRepository;
  let purchasedRepo: PurchasedRepository;
  let productRepo: ProductRepository;
  let purchaseLogRepo: PurchaseLogRepository;
  let sessionRepo: SessionRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    cartRepo = app.get(CartRepository) as CartRepository;
    stockRepo = app.get(StockRepository) as StockRepository;
    purchasedRepo = app.get(PurchasedRepository) as PurchasedRepository;
    productRepo = app.get(ProductRepository) as ProductRepository;
    purchaseLogRepo = app.get(PurchaseLogRepository) as PurchaseLogRepository;
    sessionRepo = app.get(SessionRepository) as SessionRepository;
  });

  beforeEach(async () => {
    await cartRepo.delete({});
    await stockRepo.delete({});
    await purchasedRepo.delete({});
    await purchaseLogRepo.delete({});
    await productRepo.delete({});
    await sessionRepo.delete({});

    sandbox.reset();
  });

  afterAll(() => app.close());

  it('records transaction in the log when buying product', async () => {
    const agentInstance = agent(app.getHttpServer());
    const result = await agentInstance
      .post('/cart')
      .send(<AddToCartDto>{ idName: 'first2', size: 's' })
      .expect(201);

    const session = getSessionIdFromCookie(result.headers['set-cookie'][0]);

    const sessionObj = await sessionRepo.findOne({ id: session });
    sessionObj.setFieldInData('email', 'tests');

    await sessionRepo.save(sessionObj);

    await stockRepo.insert({ idName: 'first2', s: 5, m: 5 });

    await agentInstance.post('/cart/products-paid').expect(201);

    assert.match((await purchaseLogRepo.find({}))[0], {
      logData: match({
        userData: match({ email: 'tests' }),
        products: match([
          match({
            idName: 'first2',
            size: 's',
            amount: 1,
          }),
        ]),
      }),
    });
  });
});
