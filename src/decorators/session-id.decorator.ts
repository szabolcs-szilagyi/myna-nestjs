import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const sessionId = request.sessionID;

    return sessionId;
  },
);
