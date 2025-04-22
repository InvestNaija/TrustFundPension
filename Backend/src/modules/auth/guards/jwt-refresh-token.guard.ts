import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_TOKEN_TYPE } from '../../../core/constants';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard(
  JWT_TOKEN_TYPE.REFRESH_TOKEN,
) {
  constructor() {
    super();
  }
}
