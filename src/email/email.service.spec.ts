import { Test } from '@nestjs/testing';
import Sinon, { assert, createSandbox, match, stub } from 'sinon';
import { EmailService, PreparedEmail } from './email.service';
import { ConfigService } from '@nestjs/config';
import { UserDataDto } from '../session/user-data.dto';

const sandbox = createSandbox();
const realStubs = createSandbox();

describe('EmailService', () => {
  let emailService: EmailService;
  let serviceMocks: Map<any, any>;
  let sendEmailStub: Sinon.SinonStub<[PreparedEmail], Promise<void>>;

  beforeAll(async () => {
    serviceMocks = new Map<any, any>([
      [
        ConfigService,
        {
          get: sandbox.stub().returns({ smtp: {} }),
        },
      ],
    ]);

    const moduleRef = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: serviceMocks.get(ConfigService),
        },
      ],
    }).compile();

    emailService = moduleRef.get(EmailService);
    sendEmailStub = stub(emailService, 'sendEmail');
  });

  beforeEach(() => {
    sandbox.resetHistory();
    realStubs.restore();
    sendEmailStub.reset();
    sendEmailStub.resolves();
  });

  describe('sendPurchaseEmailNew', () => {
    it('works if all is fine', async () => {
      await emailService.sendPurchaseEmailNew({} as UserDataDto, [], '30$');
    });

    it('fills all needed fields for the email', async () => {
      await emailService.sendPurchaseEmailNew(
        { email: 'asdf' } as UserDataDto,
        [],
        '30$',
      );

      assert.calledOnceWithMatch(sendEmailStub, {
        to: 'asdf',
        subject: 'New Order',
        textBody: match.string,
        htmlBody: match.string,
      } as any);
    });

    it('email body will contain the product and its size', async () => {
      await emailService.sendPurchaseEmailNew(
        { email: 'asdf' } as UserDataDto,
        [{ idName: 'one', size: 'big' }],
        '30$',
      );

      assert.calledOnceWithMatch(sendEmailStub, {
        to: 'asdf',
        subject: 'New Order',
        textBody: match('one - big'),
        htmlBody: match('one - big'),
      } as any);
    });

    it('email body will contain the product and its size for multiple', async () => {
      await emailService.sendPurchaseEmailNew(
        { email: 'asdf' } as UserDataDto,
        [
          { idName: 'one', size: 'big' },
          { idName: 'two', size: 'small' },
        ],
        '30 EUR',
      );

      assert.calledOnceWithMatch(sendEmailStub, {
        to: 'asdf',
        subject: 'New Order',
        textBody: match('one - big, two - small'),
        htmlBody: match('one - big, two - small'),
      } as any);
    });
  });
});
