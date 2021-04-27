import { agent } from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assert, match } from 'sinon';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NewsletterRepository } from './newsletter.repository';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';

describe('NewsletterController', () => {
  let app: INestApplication;
  let newsletterRepo: NewsletterRepository;

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
          NewsletterRepository
        ]),
        EmailModule,
      ],
      controllers: [NewsletterController],
      providers: [
        NewsletterService,
      ],
    })
      .overrideProvider(EmailService)
      .useValue({
        sendNewsletterConfirmationEmail: () => Promise.resolve(),
        sendSubscribedEmail: () => Promise.resolve(),
        sendUnsubscribedEmail: () => Promise.resolve(),
      } as Partial<EmailService>)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    newsletterRepo = app.get(NewsletterRepository) as NewsletterRepository;
  });

  beforeEach(async () => {
    await newsletterRepo.delete({});
  })

  afterAll(() => app.close());

  describe('POST subscribe', () => {
    it('records news subscription', async () => {
      return agent(app.getHttpServer())
        .post('/newsletter/subscribe')
        .send({ email: 'hello@123.hu' })
        .expect(201)
        .then(({ body }) => assert.match(body, { success: '1', token: match.string }));
    });

    it('will not register the same e-mail again', async () => {
      await agent(app.getHttpServer())
        .post('/newsletter/subscribe')
        .send({ email: 'hello@123.hu' })
        .expect(201)
        .then(({ body }) => assert.match(body, { success: '1', token: match.string }));

      return agent(app.getHttpServer())
        .post('/newsletter/subscribe')
        .send({ email: 'hello@123.hu' })
        .expect(201)
        .then(({ body }) => assert.match(body, { success: '0' }));
    });
  });

  describe('GET confirm', () => {
    it('should be resistent', async () => {
      return agent(app.getHttpServer())
        .get('/newsletter/confirm')
        .expect(400);
    });

    it('should return OK if manages to activate', async () => {
      const token = await agent(app.getHttpServer())
        .post('/newsletter/subscribe')
        .send({ email: 'hello@123123123.hu' })
        .expect(201)
        .then(({ body }) => (body.token));

      return agent(app.getHttpServer())
        .get('/newsletter/confirm')
        .query({ token })
        .expect(200);
    });

    it('should return 404 if the provided token does not exist', async () => {
      return agent(app.getHttpServer())
        .get('/newsletter/confirm')
        .query({ token: 'no such thing' })
        .expect(404);
    });
  })

  describe('GET unsubscribe', () => {
    it('should expect proper parameters', async () => {
      return agent(app.getHttpServer())
        .get('/newsletter/unsubscribe')
        .expect(400);
    });

    it('should remove subscription', async () => {
      const email = 'kdls@ksdjfk.ru';
      const token = await agent(app.getHttpServer())
        .post('/newsletter/subscribe')
        .send({ email })
        .expect(201)
        .then(({ body }) => (body.token));

      await agent(app.getHttpServer())
        .get('/newsletter/unsubscribe')
        .query({ email, token })
        .expect(200);

      const subscriptionRecord = await newsletterRepo.findOne({ email });

      expect(subscriptionRecord?.id).toBeUndefined();
    });
  })
});
