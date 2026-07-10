import { JwtUser } from '@/modules/auth/interfaces/jwt.user.interface';
import { Request } from 'express';

export interface JwtRequest extends Request {
  user: JwtUser;
}
