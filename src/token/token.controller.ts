import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PurifiedToken } from './decorators/purified-token.decorator';
import { CustomHeaders } from './decorators/custom-headers.decorator';
import { EmailStripperPipe } from './pipes/email-stripper.pipe';
import { TokenService } from './token.service';
import { UserDataDto } from '../user/dto/user-data.dto';

@Controller('token')
export class TokenController {
  constructor(
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Post('mail-login')
  async mailLogin(@Body('email', EmailStripperPipe) email: string): Promise<object> {
    const loginToken = await this.tokenService.getLoginToken(email);

    return {
      logintoken: loginToken,
      email,
    }
  }

  @Post('login')
  async login(
    @Body('email', EmailStripperPipe) email: string,
    @PurifiedToken('login-token') loginToken: string,
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    const isAuthorized = await this.tokenService.authorizeLogin(email, loginToken);
    const isSessionGood = await this.tokenService.validateSessionToken(sessionToken);
    let successful = '0';

    if(isAuthorized && isSessionGood) {
      const emailExist = await this.userService.checkEmailExistInDatabase(email);
      if(!emailExist) {
		    await this.userService.createStubUser(email);
      }
		  await this.tokenService.setEmailToSession(email, sessionToken);
      await this.userService.updateLastLogin(email);
      successful = '1';
    } else {
		  sessionToken = await this.tokenService.setSessionToken();
      successful = '0';
    }

    return {
      login_successful: successful,
      email,
      sessiontoken: sessionToken,
    }
  }

  @Get('ping')
  async ping(
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    const isSessionValid = await this.tokenService.validateSessionToken(sessionToken);

    /**
     * This logic about the deletion is point less: the `validateSessionToken`
     * doesn't check if the session token is still valid or not, just returns
     * true _if_ there is a record with matching token. This is how it was in
     * the old system so for the time of the migration I would not change on it,
     * but would worth a cleanup in the logic
     */
    let pong: string;
    if(isSessionValid) {
      await this.tokenService.fakeExtendSession(sessionToken);
      pong = '1';
    } else {
      await this.tokenService.deleteSession(sessionToken);
      sessionToken = await this.tokenService.setSessionToken();
      pong = '0';
    }

    return {
      pong,
      sessiontoken: sessionToken,
    }
  }

  @Get('am-i-logged-in')
  async amILoggedIn(
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    const isSesstionValid = await this.tokenService.validateSessionToken(sessionToken);

    let email: string;
    if(isSesstionValid) {
      email = await this.tokenService.getEmailBySessionToken(sessionToken)
    } else {
      email = 'nodata';
    }

    return { email };
  }

  @Get('get-user-data')
  async getUserData(
    @PurifiedToken('session-token') sessionToken: string,
    @CustomHeaders('email', EmailStripperPipe) email: string,
  ): Promise<UserDataDto | string> {
    const isSessionValid = await this.tokenService.validateSessionTokenStrict(sessionToken, email);
    let userData: string | UserDataDto;
    if(isSessionValid) {
      userData = await this.userService.getUserData(email);
    } else {
      userData = '0';
    }

    return userData;
  }

  @Post('update-user-data')
  async updateUserData(
    @PurifiedToken('session-token') sessionToken: string,
    @Body() userDataDto: UserDataDto,
  ) {
    const isSessionValid = await this.tokenService.validateSessionTokenStrict(sessionToken, userDataDto.email);

    let success: string;
    if(isSessionValid) {
      await this.userService.updateUserData(userDataDto);
      success = '1';
    } else {
      success = '0';
    }

    return { success };
  }

  @Get('get-email')
  async getEmail(
    @PurifiedToken('session-token') sessionToken: string,
  ) {
    const isSesstionValid = await this.tokenService.validateSessionToken(sessionToken);

    let email: string | null;
    if(isSesstionValid) {
      email = await this.tokenService.getEmailBySessionToken(sessionToken);
    } else {
      email = null;
    }

    return { email };
  }

  @Get('session')
  async getSessionToken() {
    const sessionToken = await this.tokenService.setSessionToken();

    return { sessiontoken: sessionToken };
  }
}
