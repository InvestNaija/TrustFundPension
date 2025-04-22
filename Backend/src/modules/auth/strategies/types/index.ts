import { USER_ROLE } from '../../../../core/constants';

export interface IDecodedJwtToken {
  id: number; //userId
  role: USER_ROLE;
}
