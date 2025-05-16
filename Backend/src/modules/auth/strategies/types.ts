import { USER_ROLE } from '../../../core/constants';

export interface IDecodedJwtToken {
  id: string;
  role: USER_ROLE;
} 