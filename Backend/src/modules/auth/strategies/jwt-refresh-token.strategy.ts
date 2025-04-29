import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IDecodedJwtToken } from './types';
import { JWT_TOKEN_TYPE } from '../../../core/constants';
import { envConfig } from '../../../core/config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_TOKEN_TYPE.REFRESH_TOKEN,
) {
  constructor() {
    if (!envConfig.JWT_REFRESH_TOKEN_SECRET) {
      throw new Error('JWT_REFRESH_TOKEN_SECRET is not configured');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;

          if (req && req.cookies) {
            token = req.cookies['refreshToken']; // Cookie extraction
          }

          if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]; // Header extraction
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: envConfig.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  validate(decodedToken: IDecodedJwtToken) {
    return decodedToken;
  }
}
