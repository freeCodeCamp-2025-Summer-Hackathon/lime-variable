import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  <T extends keyof AuthenticatedUser | undefined = undefined>(
    data: T,
    ctx: ExecutionContext,
  ) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (data) {
      return user ? user[data] : undefined;
    }
    return user;
  },
);
