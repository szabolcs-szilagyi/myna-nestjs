import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PurifiedToken = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const rawHeaderValue = request.headers?.[field];
    const value =
      typeof rawHeaderValue === 'string'
        ? rawHeaderValue.replace('/[^a-zA-Z0-9-]+/g', '')
        : '';
    return value;
  },
);
