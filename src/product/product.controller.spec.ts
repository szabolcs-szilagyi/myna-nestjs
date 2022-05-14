import { agent } from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assert, match } from 'sinon';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { CartRepository } from '../cart/cart.repository';
import { SessionRepository } from '../session/session.repository';

describe('ProductController', () => {
  let app: INestApplication;
  let productRepo: ProductRepository;

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
          ProductRepository,
          SessionRepository,
        ]),
      ],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    productRepo = app.get(ProductRepository) as ProductRepository;
  });

  beforeEach(async () => {
    await productRepo.delete({});
  });

  afterAll(() => app.close());

  describe('GET basic-info', () => {
    it('should return empty', () => {
      return agent(app.getHttpServer())
        .get('/product/basic-infos')
        .expect(200)
        .then(({ body }) => assert.match(body, []));
    });

    it('returns just the needed fields', async () => {
      await productRepo.insert({
        idName: 'my-dat-product',
        availability: 'Available',
        isOneSize: 0,
        name: 'My AWESOME product',
        color: 'black ofcourse...',
        price: 894,
        description: 'oh yeah, buy this',
        compCare: 'handwash only!',
        pic1: 'tslkdfj.png',
      });
      return agent(app.getHttpServer())
        .get('/product/basic-infos')
        .expect(200)
        .then(({ body }) =>
          assert.match(body, [
            match({
              idName: 'my-dat-product',
              price: 894,
              pic1: 'tslkdfj.png',
            }),
          ]),
        );
    });
  });
});
