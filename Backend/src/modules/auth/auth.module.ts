import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user';
import { ThirdPartyServicesModule } from '../third-party-services';
import { ReferralModule } from '../referral';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../user/entities';
import { UserRoleRepository } from '../user/repositories/user-role.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY },
    }),
    TypeOrmModule.forFeature([UserRole]),
    UserModule,
    ThirdPartyServicesModule,
    ReferralModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRoleRepository],
})
export class AuthModule {}
