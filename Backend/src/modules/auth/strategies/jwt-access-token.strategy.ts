import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { IDecodedJwtToken } from './types';
import { JWT_TOKEN_TYPE } from '../../../core/constants';
import { envConfig } from '../../../core/config';

export class JwtAccessTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_TOKEN_TYPE.ACCESS_TOKEN,
) {
  constructor() {
    if (!envConfig.JWT_ACCESS_TOKEN_SECRET) {
      throw new Error('JWT_ACCESS_TOKEN_SECRET is not configured');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;

          if (req && req.cookies) {
            token = req.cookies['accessToken']; // Cookie extraction
          }

          if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1]; // Header extraction
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: envConfig.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  validate(decodedToken: IDecodedJwtToken) {
    return decodedToken;
  }
}
