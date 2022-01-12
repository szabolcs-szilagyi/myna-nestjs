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
import { Session as ExpressSession } from 'express-session';
import { validate } from 'class-validator';

@Controller('session')
export class SessionController {
  @UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
  @Post()
  async saveUserDetails(
    @Session() session: ExpressSession,
    @Body() userData: UserDataDto,
  ) {
    Object.assign(session, userData);
    await promisify(session.save.bind(session))();
  }

  @Get('is-valid')
  async isValid(@Session() session: ExpressSession) {
    const userData = plainToClass(UserDataDto, session, {
      excludeExtraneousValues: true,
    });
    const errors = await validate(userData);

    return { isValid: !errors.length };
  }
}
