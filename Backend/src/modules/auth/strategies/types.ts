import { USER_ROLE } from '../../../core/constants';

export interface IDecodedJwtToken {
  id: string;
  userRoles: Array<{
    id: string;
    userId: string;
    roleId: string;
  }>;
} 