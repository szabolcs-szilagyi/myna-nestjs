import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CustomHeaders = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const rawHeaderValue = request.headers?.[field]
    const value = typeof rawHeaderValue === 'string' ?
      rawHeaderValue :
      undefined;

    return value;
  },
);
