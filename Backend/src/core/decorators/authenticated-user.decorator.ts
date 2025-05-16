import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_ROLE } from '../constants';

export interface IDecodedJwtToken {
  id: string;
  role: USER_ROLE;
}

export const AuthenticatedUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().user as IDecodedJwtToken;
    }
  },
);
