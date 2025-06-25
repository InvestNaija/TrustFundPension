import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../../../modules/user/services';
import { UserRoleService } from '../../../modules/user/services';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';
import { UserRole } from 'src/modules/user/entities';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    let user: UserRole | null = null;

    const authenticatedUser = request.user as IDecodedJwtToken;
    if (authenticatedUser?.id) {
      user = await this.userRoleService.findOneAuthAdmin(authenticatedUser.id);
      if(user.role.name == 'admin') return true
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return false;
  }
}