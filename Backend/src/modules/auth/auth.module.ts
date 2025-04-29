import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user';
import { ThirdPartyServicesModule } from '../third-party-services';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY },
    }),
    UserModule,
    ThirdPartyServicesModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
