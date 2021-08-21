import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomInt } from 'crypto';
import { LoginTokenRepository } from './login-token.repository';
import { DateTime } from 'luxon';
import { SessionTokenRepository } from './session-token.repository';

type MD5Hash = string;
type email = string;

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(LoginTokenRepository)
    private readonly loginTokenRepository: LoginTokenRepository,
    @InjectRepository(SessionTokenRepository)
    private readonly sessionTokenRepository: SessionTokenRepository,
  ) {}

  private getNow(): string {
    const now = DateTime.fromISO(new Date().toISOString(), {
      zone: 'Europe/London',
    }).toFormat('yyyy-MM-dd HH:mm:ss');

    return now;
  }

  private generateSessionToken(now: string): MD5Hash {
    const toHash = [randomInt(10000, 99999), now, randomInt(10000, 99999)].join(
      '',
    );
    const sessionToken = createHash('md5').update(toHash).digest('hex');

    return sessionToken;
  }

  async getLoginToken(email: string): Promise<MD5Hash> {
    const now = this.getNow();

    const toHash = [email, now, randomInt(10000, 99999)].join('');
    const hash = createHash('md5').update(toHash).digest('hex');

    await this.loginTokenRepository.insert({
      email,
      loginToken: hash,
      createTime: now,
    });

    return hash;
  }

  async authorizeLogin(email: string, loginToken: MD5Hash): Promise<boolean> {
    const tokenRecord = await this.loginTokenRepository.findOne(
      { email, loginToken },
      { select: ['id'] },
    );

    return tokenRecord?.id !== undefined;
  }

  async validateSessionToken(sessionToken: string) {
    const tokenRecord = await this.sessionTokenRepository.findOne(
      { sessionToken },
      { select: ['id'] },
    );

    return tokenRecord?.id !== undefined;
  }

  async validateSessionTokenStrict(sessionToken: string, email: email) {
    const tokenRecord = await this.sessionTokenRepository.findOne(
      { sessionToken, email },
      { select: ['id'] },
    );

    return tokenRecord?.id !== undefined;
  }

  setEmailToSession(email: string, sessionToken: string): Promise<any> {
    return this.sessionTokenRepository.update({ sessionToken }, { email });
  }

  async setSessionToken(): Promise<string> {
    const now = this.getNow();

    const email = 'nodata';
    const sessionToken = this.generateSessionToken(now);

    await this.sessionTokenRepository.insert({
      email,
      sessionToken,
      createTime: now,
    });

    return sessionToken;
  }

  async fakeExtendSession(sessionToken: string): Promise<void> {
    const now = DateTime.fromISO(new Date().toISOString(), {
      zone: 'Europe/London',
    }).toFormat('yyyy-MM-dd HH:mm:ss');

    await this.sessionTokenRepository.update(
      { sessionToken },
      { createTime: now },
    );
  }

  async deleteSession(sessionToken: string): Promise<void> {
    await this.sessionTokenRepository.delete({ sessionToken });
  }

  async getEmailBySessionToken(sessionToken: string): Promise<email> {
    const tokenRecord = await this.sessionTokenRepository.findOne(
      { sessionToken },
      { select: ['email'] },
    );
    return tokenRecord?.email;
  }
}
