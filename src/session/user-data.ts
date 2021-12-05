import { Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { plainToClass } from 'class-transformer';
import { UserDataDto } from './user-data.dto';

export const USER_DATA = 'USER_DATA';

export const userDataProvider = {
  scope: Scope.REQUEST,
  provide: USER_DATA,
  inject: [REQUEST],
  useFactory: (request: Request) => {
    const session = request.session;
    const userData = plainToClass(UserDataDto, session, {
      excludeExtraneousValues: true,
    });

    return userData;
  },
};
