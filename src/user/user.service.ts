import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import omit from 'lodash.omit';
import { UserRepository } from './user.repository';
import { DateTime } from 'luxon';
import { UserDataDto } from './dto/user-data.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async checkEmailExistInDatabase(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne(
      { email },
      { select: ['id'] },
    );

    return user?.id !== undefined;
  }

  async createStubUser(email: string): Promise<void> {
    const now = DateTime.fromISO(new Date().toISOString(), {
      zone: 'Europe/London',
    }).toFormat('yyyy-MM-dd HH:mm:ss');

    await this.userRepository.insert({
      email,
      firstName: 'nodata',
      lastName: 'nodata',
      lastLogin: now,
      birthday: '1901-01-01',
    });
  }

  async updateLastLogin(email: string): Promise<void> {
    const now = DateTime.fromISO(new Date().toISOString(), {
      zone: 'Europe/London',
    }).toFormat('yyyy-MM-dd HH:mm:ss');

    await this.userRepository.update({ email }, { lastLogin: now });
  }

  async getUserData(email: string): Promise<UserDataDto> {
    const userRecord = await this.userRepository.findOne({ email });

    return omit(userRecord, ['id']) as UserDataDto;
  }

  async updateUserData(userDataDto: UserDataDto): Promise<void> {
    const { email, firstName, lastName, birthday } = userDataDto;
    await this.userRepository.update(
      { email },
      { firstName, lastName, birthday },
    );
  }
}
