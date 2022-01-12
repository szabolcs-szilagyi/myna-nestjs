import { Test } from '@nestjs/testing';
import { CartService } from './cart.service';
import { assert, createSandbox } from 'sinon';
import { PurchaseLogService } from '../purchase-log/purchase-log.service';
import { CartRepository } from './cart.repository';
import { StockRepository } from './stock.repository';
import { TransactionalRepository } from '../transactional-repository/transactional-repository';
import { EmailService } from '../email/email.service';
import { UserDataDto } from '../session/user-data.dto';

const sandbox = createSandbox();
const realStubs = createSandbox();

describe('CartService', () => {
  let cartService: CartService;
  let repoMocks: Map<any, any>;
  let serviceMocks: Map<any, any>;

  beforeAll(async () => {
    repoMocks = new Map<any, any>([
      [
        CartRepository,
        {
          getProductsInCart: sandbox.stub().returns([]),
        },
      ],
      [StockRepository, {}],
    ]);

    serviceMocks = new Map<any, any>([
      [
        PurchaseLogService,
        {
          recordPurchase: sandbox.stub(),
        },
      ],
      [
        EmailService,
        {
          sendPurchaseEmailNew: sandbox.stub().resolves(),
        },
      ],
    ]);

    const moduleRef = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartRepository,
          useValue: repoMocks.get(CartRepository),
        },
        {
          provide: StockRepository,
          useValue: repoMocks.get(StockRepository),
        },
        {
          provide: TransactionalRepository,
          useValue: {
            getCustomRepository(repoClass: any) {
              return repoMocks.get(repoClass);
            },
          },
        },
        {
          provide: PurchaseLogService,
          useValue: serviceMocks.get(PurchaseLogService),
        },
        {
          provide: EmailService,
          useValue: serviceMocks.get(EmailService),
        },
      ],
    }).compile();

    cartService = moduleRef.get(CartService);
  });

  afterEach(() => {
    sandbox.resetHistory();
    realStubs.restore();
  });

  describe('setProductsPaid', () => {
    it('works if all is fine', async () => {
      await cartService.setProductsPaid(null, 'asdf', 'fes');
    });
  });

  /**
   * The `completePurchase` method is called by the front end _after_ the
   * payment been deemed successful! So it should be robust, if the DB is down,
   * it should still try to send e-mail and vica-versa. If e-mail fails it
   * should still try to record in DB.
   */
  describe('completePurchase', () => {
    const genericUserData: UserDataDto = {
      name: 'asdf',
      email: 'asdf',
      mobile: 'asdf',
      addressLine1: 'asdf',
      city: 'asdf',
      state: 'asdf',
      zip: '1234',
      country: 'asdf',
    };

    it('works if all is fine', async () => {
      await cartService.completePurchase('asdf', genericUserData);
    });

    it('uses the old setProductsPaid', async () => {
      const setProductsPaidStub = realStubs.stub(
        cartService,
        'setProductsPaid',
      );
      setProductsPaidStub.resolves();

      await cartService.completePurchase('asdf', genericUserData);
      assert.calledOnce(setProductsPaidStub);
    });

    it('will also call the e-mail service', async () => {
      const emailServiceMock = serviceMocks.get(EmailService);
      await cartService.completePurchase('asdf', genericUserData);
      assert.calledOnce(emailServiceMock.sendPurchaseEmailNew);
    });

    it('calls e-mail service even if setProductsPaid fails', async () => {
      const setProductsPaidStub = realStubs.stub(
        cartService,
        'setProductsPaid',
      );
      setProductsPaidStub.rejects();

      const emailServiceMock = serviceMocks.get(EmailService);

      await expect(() =>
        cartService.completePurchase('adf', genericUserData),
      ).rejects.toThrow();

      assert.calledOnce(emailServiceMock.sendPurchaseEmailNew);
    });

    it('calls setProductsPaid even if e-mail fails', async () => {
      const setProductsPaidStub = realStubs.stub(
        cartService,
        'setProductsPaid',
      );
      setProductsPaidStub.resolves();

      const emailServiceMock = serviceMocks.get(EmailService);
      emailServiceMock.sendPurchaseEmailNew.rejects();

      await expect(() =>
        cartService.completePurchase('adf', genericUserData),
      ).rejects.toThrow();

      assert.calledOnce(setProductsPaidStub);
    });

    it('forwards the error from e-mail service', async () => {
      const setProductsPaidStub = realStubs.stub(
        cartService,
        'setProductsPaid',
      );
      setProductsPaidStub.resolves();

      const emailError = new Error();

      const emailServiceMock = serviceMocks.get(EmailService);
      emailServiceMock.sendPurchaseEmailNew.rejects(emailError);

      await expect(() =>
        cartService.completePurchase('adf', genericUserData),
      ).rejects.toHaveProperty('errors.0', emailError);

      assert.calledOnce(setProductsPaidStub);
    });

    it('also forwards the error from setProductsPaid method', async () => {
      const setProductsPaidStub = realStubs.stub(
        cartService,
        'setProductsPaid',
      );
      const setProductsPaidError = new Error();
      setProductsPaidStub.rejects(setProductsPaidError);

      await expect(() =>
        cartService.completePurchase('asdf', genericUserData),
      ).rejects.toHaveProperty('errors.0', setProductsPaidError);

      assert.calledOnce(setProductsPaidStub);
    });
  });
});
