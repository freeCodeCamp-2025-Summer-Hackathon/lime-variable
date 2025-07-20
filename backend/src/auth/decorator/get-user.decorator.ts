import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

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
