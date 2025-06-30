import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../modules/user/services';
import { UserRoleService } from '../../../modules/user/services';
import { IDecodedJwtToken } from '../../../modules/auth/strategies/types';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authenticatedUser = request.user as IDecodedJwtToken;
    
    if (!authenticatedUser?.id) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const user = await this.userRoleService.findOneAuthAdmin(authenticatedUser.id);
      
      if (!user) {
        throw new UnauthorizedException('Admin access required');
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify admin access');
    }
  }
}