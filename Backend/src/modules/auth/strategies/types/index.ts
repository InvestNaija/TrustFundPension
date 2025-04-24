import { USER_ROLE } from '../../../../core/constants';

export interface IDecodedJwtToken {
  id: string; //userId
  role: USER_ROLE;
}
