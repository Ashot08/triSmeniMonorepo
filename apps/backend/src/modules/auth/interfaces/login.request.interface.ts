import { LoginUser } from '@/modules/auth/interfaces/login.user.interface';

export interface LoginRequest extends Request {
  user: LoginUser;
}
