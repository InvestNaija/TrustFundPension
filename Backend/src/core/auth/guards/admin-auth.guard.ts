import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../../modules/user/services';
import { UserRoleService } from '../../../modules/user/services';
import { UserRoleResponseDto } from '../../../modules/user/dto';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let user: UserRoleResponseDto | null = null;

    const authenticatedUser = request.user as IDecodedJwtToken;
    if (authenticatedUser?.id) {
      user = await this.userRoleService.findOne(authenticatedUser.id);
      if(user.roleId == 'admin') return true
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }


    return false;
  }
}