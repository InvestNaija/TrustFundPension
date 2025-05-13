import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_ROLE } from '../constants';

export interface AuthenticatedUser {
  id: string;
  userRoles: Array<{
    id: string;
    userId: string;
    roleId: string;
  }>;
}

export const AuthenticatedUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().user as AuthenticatedUser;
    }
  },
);
