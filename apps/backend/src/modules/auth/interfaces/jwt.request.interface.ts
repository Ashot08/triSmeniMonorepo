import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';

export interface JwtRequest extends Request {
  user: JwtUser;
}
