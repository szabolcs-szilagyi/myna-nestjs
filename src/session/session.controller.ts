import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { promisify } from 'util';
import { UserDataDto } from './user-data.dto';
import { Session as TSession } from 'express-session';

@Controller('session')
export class SessionController {
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  @Post()
  async saveUserDetails(
    @Session() session: TSession,
    @Body() userData: UserDataDto,
  ) {
    Object.assign(session, userData);
    await promisify(session.save.bind(session))();
  }

  @Get()
  getUserDetails(@Session() session: TSession) {
    const userData = plainToClass(UserDataDto, session, {
      excludeExtraneousValues: true,
    });

    return userData;
  }
}
